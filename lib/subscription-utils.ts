import { dbAdmin } from "./firebase-admin";

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

async function createOrUpdateSubscription(
  userId: string,
  plan: string,
  flutterwaveData: any,
  txRef: string
) {
  const { customer, created_at: paymentDate, id: flutterwaveTransactionId } = flutterwaveData;

  // Check if subscription already exists for this transaction
  const existingSubscription = await dbAdmin
    .collection("subscriptions")
    .where("txRef", "==", txRef)
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
  const storageLimit = plan === "pro" ? 10737418240 : 1073741824; // 10GB for Pro, 1GB for Free

  await dbAdmin.collection("users").doc(userId).update({
    subscriptionId: subscriptionId,
    storageLimit: storageLimit,
    updatedAt: new Date(),
  });

  return subscriptionId;
}

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

export async function cancelPendingSubscription(txRef: string) {
  try {
    const subscriptionQuery = await dbAdmin
      .collection("subscriptions")
      .where("txRef", "==", txRef)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!subscriptionQuery.empty) {
      await subscriptionQuery.docs[0].ref.update({
        status: "cancelled",
        updatedAt: new Date(),
      });
      console.log(`Pending subscription ${txRef} cancelled`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error cancelling pending subscription:", error);
    throw error;
  }
}

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