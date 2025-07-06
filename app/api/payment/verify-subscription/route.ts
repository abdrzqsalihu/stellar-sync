import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const txRef = url.searchParams.get("tx_ref");
  const transactionId = url.searchParams.get("transaction_id");
  const status = url.searchParams.get("status");

  console.log("Subscription verification params:", { txRef, transactionId, status });

  if (!process.env.FLW_SECRET_KEY) {
    console.error("FLW_SECRET_KEY environment variable is not set");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
  }

  if (status === "cancelled") {
    console.log("Subscription cancelled, redirecting to dashboard");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=cancelled`);
  }

  if (!transactionId || !txRef) {
    console.log("Missing required parameters, redirecting with failed status");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
  }

  try {
    console.log("Verifying subscription transaction with Flutterwave API");
    console.log("API URL:", `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`);

    const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      console.error("Flutterwave API error:", res.status, res.statusText);
      try {
        const errorData = await res.text();
        console.error("Error response body:", errorData);
      } catch (e) {
        console.error("Could not read error response");
      }
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
    }

    const data = await res.json();
    console.log("Flutterwave response:", JSON.stringify(data, null, 2));

    if (data.status === "success" && data.data?.status === "successful") {
      console.log("Subscription transaction verified successfully");

      const userId = data.data.meta?.userId;
      const plan = data.data.meta?.plan || "pro";

      if (!userId) {
        console.error("No userId found in transaction meta data");
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
      }

      console.log("Processing subscription for userId:", userId, "plan:", plan);

      await handleSubscriptionPayment(userId, plan, data.data, txRef);

      console.log("Subscription processed successfully");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`);
    } else {
      console.log("Transaction verification failed:", data.status, data.data?.status);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
    }
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
  }
}

export async function handleSubscriptionPayment(userId: string, plan: string, transactionData: any, txRef: string) {
  try {
    console.log("Handling subscription payment for user:", userId);

    const userDoc = await dbAdmin.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      console.error("User not found for userId:", userId);
      throw new Error("User not found");
    }
    const userData = userDoc.data();
    const userEmail = userData.email;
    const userName = userData.fullName || "Customer";

    console.log("Using original user data:", { email: userEmail, name: userName });
    console.log("Flutterwave modified data:", {
      email: transactionData.customer?.email,
      name: transactionData.customer?.name,
    });

    const isInitialSubscription = txRef.startsWith('sub-');

    await dbAdmin.runTransaction(async (transaction) => {
      const subscriptionRef = dbAdmin.collection("subscriptions").doc(userId);
      const paymentRef = dbAdmin.collection("payments").doc(transactionData.id.toString());
      const userRef = dbAdmin.collection("users").doc(userId);

      if (isInitialSubscription) {
        const subscriptionQuery = await dbAdmin
          .collection('subscriptions')
          .where('userId', '==', userId)
          .where('status', '==', 'pending')
          .where('txRef', '==', txRef)
          .get();

        if (!subscriptionQuery.empty) {
          const subscriptionDoc = subscriptionQuery.docs[0];
          transaction.update(subscriptionDoc.ref, {
            status: 'active',
            subscriptionId: transactionData.id,
            flutterwaveTransactionId: transactionData.id,
            startDate: new Date(),
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            lastPaymentDate: new Date(transactionData.created_at),
            email: userEmail,
            name: userName,
            amount: transactionData.amount,
            currency: transactionData.currency,
            updatedAt: new Date(),
          });
          console.log("Updated pending subscription to active");
        } else {
          transaction.set(subscriptionRef, {
            userId,
            subscriptionId: transactionData.id,
            plan,
            status: 'active',
            txRef,
            amount: transactionData.amount,
            currency: transactionData.currency,
            email: userEmail,
            name: userName,
            startDate: new Date(),
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            lastPaymentDate: new Date(transactionData.created_at),
            createdAt: new Date(),
            updatedAt: new Date(),
            failedPaymentCount: 0,
          });
          console.log("Created new subscription");
        }
      } else {
        const subscriptionQuery = await dbAdmin
          .collection('subscriptions')
          .where('userId', '==', userId)
          .where('status', '==', 'active')
          .limit(1)
          .get();

        if (!subscriptionQuery.empty) {
          const subscriptionDoc = subscriptionQuery.docs[0];
          transaction.update(subscriptionDoc.ref, {
            lastPaymentDate: new Date(transactionData.created_at),
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            email: userEmail,
            name: userName,
            amount: transactionData.amount,
            currency: transactionData.currency,
            updatedAt: new Date(),
          });
          console.log("Updated subscription for recurring payment");
        } else {
          transaction.set(subscriptionRef, {
            userId,
            subscriptionId: transactionData.id,
            plan,
            status: 'active',
            txRef,
            amount: transactionData.amount,
            currency: transactionData.currency,
            email: userEmail,
            name: userName,
            startDate: new Date(),
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            lastPaymentDate: new Date(transactionData.created_at),
            createdAt: new Date(),
            updatedAt: new Date(),
            failedPaymentCount: 0,
          });
          console.log("Created new subscription for recurring payment");
        }
      }

      transaction.set(paymentRef, {
        userId,
        flutterwaveTransactionId: transactionData.id,
        amount: transactionData.amount,
        currency: transactionData.currency,
        status: transactionData.status,
        paymentDate: new Date(transactionData.created_at),
        type: isInitialSubscription ? "initial_subscription" : "recurring",
        plan,
        txRef,
        originalCustomer: {
          email: userEmail,
          name: userName,
        },
        flutterwaveCustomer: transactionData.customer,
      });

      transaction.update(userRef, {
        plan,
        subscriptionStatus: "active",
        subscriptionId: transactionData.id,
        storageLimit: getStorageLimit(plan),
        upgradeDate: new Date().toISOString(),
        updatedAt: new Date(),
      });
    });

    console.log("Subscription payment processed successfully");
  } catch (error) {
    console.error("Error handling subscription payment:", error);
    throw error;
  }
}

function getStorageLimit(plan: string): number {
  switch (plan.toLowerCase()) {
    case 'pro':
    return 4294967296;
    case 'free':
    default:
    return 1073741824;

  }
}