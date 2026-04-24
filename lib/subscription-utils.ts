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

    // Use a transaction to ensure idempotency and atomic updates
    await dbAdmin.runTransaction(async (transaction) => {
      const paymentRef = dbAdmin.collection("payments").doc(flutterwaveTransactionId.toString());
      const paymentDoc = await transaction.get(paymentRef);

      if (paymentDoc.exists) {
        console.log(`Payment ${flutterwaveTransactionId} already processed in transaction`);
        return;
      }

      // Record the payment
      transaction.set(paymentRef, {
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

      // Handle subscription creation or update
      if (isInitialPayment && !payment_plan) {
        // Find existing subscription by txRef
        const subscriptionQuery = await dbAdmin
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
          amount: amount || 5,
          currency: currency || "USD",
          email: customer.email,
          name: customer.name || "Customer",
          txRef,
          lastPaymentDate: new Date(paymentDate),
          nextPaymentDate: nextPaymentDate,
          flutterwaveTransactionId: flutterwaveTransactionId,
          updatedAt: new Date(),
        };

        let subscriptionId;
        if (subscriptionQuery.empty) {
          const newSubscriptionRef = dbAdmin.collection("subscriptions").doc();
          transaction.set(newSubscriptionRef, {
            ...subscriptionData,
            createdAt: new Date(),
          });
          subscriptionId = newSubscriptionRef.id;
        } else {
          transaction.update(subscriptionQuery.docs[0].ref, subscriptionData);
          subscriptionId = subscriptionQuery.docs[0].id;
        }

        // Update user's subscription ID and storage limit
        const storageLimit = plan === "pro" ? 10737418240 : 1073741824;
        transaction.update(dbAdmin.collection("users").doc(userId), {
          subscriptionId: subscriptionId,
          storageLimit: storageLimit,
          plan: plan,
          subscriptionStatus: "active",
          subscriptionPlan: plan,
          lastPaymentDate: new Date(paymentDate),
          updatedAt: new Date(),
        });
      } else {
        // Recurring payment or update
        const subscriptionQuery = await dbAdmin
          .collection("subscriptions")
          .where("userId", "==", userId)
          .limit(1)
          .get();

        if (!subscriptionQuery.empty) {
          const nextPaymentDate = new Date(paymentDate);
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

          transaction.update(subscriptionQuery.docs[0].ref, {
            status: "active",
            lastPaymentDate: new Date(paymentDate),
            nextPaymentDate: nextPaymentDate,
            updatedAt: new Date(),
          });
        }

        transaction.update(dbAdmin.collection("users").doc(userId), {
          plan: plan,
          subscriptionStatus: "active",
          subscriptionPlan: plan,
          lastPaymentDate: new Date(paymentDate),
          updatedAt: new Date(),
        });
      }
    });

    console.log(`Successfully processed payment for user ${userId}`);
  } catch (error) {
    console.error("Error handling subscription payment:", error);
    throw error;
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
        cancelledAt: new Date(),
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

export async function cancelAllPendingSubscriptions(userId: string) {
  try {
    const pendingSubscriptions = await dbAdmin
      .collection("subscriptions")
      .where("userId", "==", userId)
      .where("status", "==", "pending")
      .get();

    if (pendingSubscriptions.empty) {
      return 0;
    }

    const batch = dbAdmin.batch();
    pendingSubscriptions.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "cancelled",
        reason: "New subscription initiated",
        cancelledAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await batch.commit();
    console.log(`Cancelled ${pendingSubscriptions.size} pending subscriptions for user ${userId}`);
    return pendingSubscriptions.size;
  } catch (error) {
    console.error("Error cancelling all pending subscriptions:", error);
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