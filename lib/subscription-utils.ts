import { dbAdmin } from "./firebase-admin";

/**
 * Process a subscription payment: record the payment, create or update the subscription, and set the user's subscription status.
 *
 * @param userId - ID of the user who made the payment
 * @param plan - Subscription plan identifier associated with the payment
 * @param flutterwaveData - Payment payload returned by Flutterwave (expected to include `id`, `amount`, `currency`, `customer`, `created_at`, and optional `payment_plan`)
 * @param txRef - Transaction reference (references starting with `sub-` are treated as initial subscription payments)
 * @throws Propagates any error encountered while recording the payment, updating subscription documents, or updating the user document
 */
export async function handleSubscriptionPayment(
  userId: string,
  plan: string,
  flutterwaveData: any,
  txRef: string
) {
  const {
    id: flutterwaveTransactionId,
    amount,
    currency,
    customer,
    created_at: paymentDate,
    payment_plan
  } = flutterwaveData;

  try {
    const isInitialPayment = txRef.startsWith("sub-");
    const currentMonth = new Date(paymentDate).toISOString().slice(0, 7);

    console.log(`handleSubscriptionPayment: userId=${userId}, isInitial=${isInitialPayment}, hasPaymentPlan=${!!payment_plan}`);

    // Record the payment
    await dbAdmin.collection("payments").doc(flutterwaveTransactionId.toString()).set({
      userId,
      flutterwaveTransactionId,
      amount,
      currency,
      status: "successful",
      paymentDate: new Date(paymentDate),
      type: isInitialPayment && !payment_plan ? "initial_subscription" : "recurring",
      plan,
      txRef,
      billingMonth: currentMonth,
      paymentPlan: payment_plan || null,
      originalCustomer: {
        email: customer.email,
        name: customer.name || "Customer",
      },
      flutterwaveCustomer: customer,
      createdAt: new Date(),
    });

    console.log(`Payment recorded: ${flutterwaveTransactionId}`);

    // Handle subscription creation or update
    if (isInitialPayment && !payment_plan) {
      // This is an initial subscription payment
      await createOrUpdateSubscription(userId, plan, flutterwaveData, txRef);
    } else {
      // This is a recurring payment, update existing subscription
      await updateSubscriptionPayment(userId, paymentDate);
    }

    // Update user's subscription status and plan
    await dbAdmin.collection("users").doc(userId).update({
      plan: plan,
      subscriptionStatus: "active",
      subscriptionPlan: plan,
      lastPaymentDate: new Date(paymentDate),
      updatedAt: new Date(),
    });

    console.log(`Successfully processed payment for user ${userId}`);
  } catch (error) {
    console.error("Error handling subscription payment:", error);
    throw error;
  }
}

/**
 * Create or update a user's subscription based on a Flutterwave payment and attach the subscription to the user's record.
 *
 * @param userId - The Firestore user document ID to associate the subscription with
 * @param plan - The subscription plan identifier (e.g., "pro")
 * @param flutterwaveData - The Flutterwave payment payload (expects `customer`, `created_at`, and `id` fields)
 * @param txRef - The transaction reference to store on the subscription record
 * @returns The Firestore subscription document ID that was created or updated
 */
async function createOrUpdateSubscription(
  userId: string,
  plan: string,
  flutterwaveData: any,
  txRef: string
) {
  const { customer, created_at: paymentDate, id: flutterwaveTransactionId } = flutterwaveData;

  // Check if subscription already exists
  const existingSubscription = await dbAdmin
    .collection("subscriptions")
    .where("userId", "==", userId)
    .limit(1)
    .get();

  const nextPaymentDate = new Date(paymentDate);
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  const subscriptionData = {
    userId,
    plan,
    status: "active",
    amount: 5,
    currency: "USD",
    email: customer.email,
    name: customer.name || "Customer",
    txRef,
    lastPaymentDate: new Date(paymentDate),
    nextPaymentDate: nextPaymentDate,
    flutterwaveTransactionId: flutterwaveTransactionId,
    updatedAt: new Date(),
  };

  let subscriptionId;

  if (existingSubscription.empty) {
    // Create new subscription
    const newSubscriptionRef = await dbAdmin.collection("subscriptions").add({
      ...subscriptionData,
      createdAt: new Date(),
    });
    subscriptionId = newSubscriptionRef.id;
    console.log(`New subscription created: ${subscriptionId}`);
  } else {
    // Update existing subscription
    await existingSubscription.docs[0].ref.update(subscriptionData);
    subscriptionId = existingSubscription.docs[0].id;
    console.log(`Existing subscription updated: ${subscriptionId}`);
  }

  // Update user with subscription ID
  const storageLimit = plan === "pro" ? 4294967296 : 1073741824; // 4GB for Pro, 1GB for Free

  await dbAdmin.collection("users").doc(userId).update({
    subscriptionId: subscriptionId,
    storageLimit: storageLimit,
    updatedAt: new Date(),
  });

  return subscriptionId;
}

/**
 * Update a user's subscription record when a recurring payment is processed.
 *
 * Sets the subscription's status to "active", updates `lastPaymentDate` to the provided payment date,
 * sets `nextPaymentDate` to one month after the provided payment date, and refreshes `updatedAt`.
 * If no subscription exists for the given user, no update is made (a warning is logged).
 *
 * @param userId - The ID of the user whose subscription should be updated
 * @param paymentDate - The payment date/time as a string (any value parseable by `Date`) used to compute `lastPaymentDate` and `nextPaymentDate`
 */
async function updateSubscriptionPayment(userId: string, paymentDate: string) {
  const subscriptionQuery = await dbAdmin
    .collection("subscriptions")
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (!subscriptionQuery.empty) {
    const nextPaymentDate = new Date(paymentDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    await subscriptionQuery.docs[0].ref.update({
      status: "active",
      lastPaymentDate: new Date(paymentDate),
      nextPaymentDate: nextPaymentDate,
      updatedAt: new Date(),
    });

    console.log(`Subscription payment updated for user ${userId}`);
  } else {
    console.warn(`No active subscription found for user ${userId}`);
  }
}

/**
 * Cancel an active subscription for the specified user.
 *
 * @param userId - The ID of the user whose active subscription should be cancelled
 * @returns `true` if an active subscription was found and cancelled, `false` if no active subscription existed
 * @throws Re-throws any error encountered while querying or updating the database
 */
export async function cancelSubscription(userId: string) {
  try {
    const subscriptionQuery = await dbAdmin
      .collection("subscriptions")
      .where("userId", "==", userId)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (!subscriptionQuery.empty) {
      await subscriptionQuery.docs[0].ref.update({
        status: "cancelled",
        cancelledAt: new Date(),
        nextPaymentDate: null,
        updatedAt: new Date(),
      });

      await dbAdmin.collection("users").doc(userId).update({
        subscriptionStatus: "cancelled",
        updatedAt: new Date(),
      });

      console.log(`Subscription cancelled for user ${userId}`);
      return true;
    }
    
    console.warn(`No active subscription found to cancel for user ${userId}`);
    return false;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
}

/**
 * Checks whether a user currently has an active, non-overdue subscription and returns that subscription's details.
 *
 * If the subscription's next payment date is more than 3 days past, the function updates the subscription and user
 * records to mark the subscription as `"overdue"` and returns `hasActiveSubscription: false` with the subscription data
 * (status set to `"overdue"`).
 *
 * @param userId - The ID of the user whose subscription status will be checked
 * @returns An object with `hasActiveSubscription` (`true` if an active, non-overdue subscription exists, `false` otherwise)
 *          and `subscription` (the subscription document data when present, or `null`)
 * @throws If a database operation fails while reading or updating subscription/user records
 */
export async function checkUserSubscriptionStatus(userId: string) {
  try {
    const subscriptionQuery = await dbAdmin
      .collection("subscriptions")
      .where("userId", "==", userId)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (subscriptionQuery.empty) {
      return { hasActiveSubscription: false, subscription: null };
    }

    const subscription = subscriptionQuery.docs[0].data();
    const now = new Date();
    const nextPaymentDate = subscription.nextPaymentDate?.toDate();

    // Check if subscription is overdue (more than 3 days past due date)
    const isOverdue = nextPaymentDate && now > new Date(nextPaymentDate.getTime() + 3 * 24 * 60 * 60 * 1000);

    if (isOverdue) {
      // Mark subscription as overdue
      await subscriptionQuery.docs[0].ref.update({
        status: "overdue",
        updatedAt: new Date(),
      });

      await dbAdmin.collection("users").doc(userId).update({
        subscriptionStatus: "overdue",
        updatedAt: new Date(),
      });

      console.log(`Subscription marked as overdue for user ${userId}`);
      return { hasActiveSubscription: false, subscription: { ...subscription, status: "overdue" } };
    }

    return { hasActiveSubscription: true, subscription };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw error;
  }
}