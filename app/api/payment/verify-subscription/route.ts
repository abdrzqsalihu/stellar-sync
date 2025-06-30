import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const txRef = url.searchParams.get("tx_ref");
  const transactionId = url.searchParams.get("transaction_id");
  const status = url.searchParams.get("status");

  console.log("Subscription verification params:", { txRef, transactionId, status });
  
  // Check if secret key is available
  if (!process.env.FLW_SECRET_KEY) {
    console.error("FLW_SECRET_KEY environment variable is not set");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
  }
  
  console.log("Secret key available:", !!process.env.FLW_SECRET_KEY);

  // Handle cancelled status first
  if (status === "cancelled") {
    console.log("Subscription cancelled, redirecting to dashboard");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=cancelled`);
  }

  // Check for missing required parameters
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

    // Check if the API call was successful and the transaction status is success
    if (data.status === "success" && data.data?.status === "successful") {
      console.log("Subscription transaction verified successfully");
      
      // Get user ID and plan from meta data
      const userId = data.data.meta?.userId;
      const plan = data.data.meta?.plan || "pro";
      
      if (!userId) {
        console.error("No userId found in transaction meta data");
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
      }

      console.log("Processing subscription for userId:", userId, "plan:", plan);
      
      // Handle subscription payment
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

// Handle subscription payment
async function handleSubscriptionPayment(userId: string, plan: string, transactionData: any, txRef: string) {
  try {
    console.log("Handling subscription payment for user:", userId);

    // Check if this is initial subscription or recurring payment
    const isInitialSubscription = txRef.startsWith('sub-');
    
    if (isInitialSubscription) {
      // Initial subscription - update pending subscription to active
      console.log("Processing initial subscription");
      
      const subscriptionQuery = await dbAdmin
        .collection('subscriptions')
        .where('userId', '==', userId)
        .where('status', '==', 'pending')
        .where('txRef', '==', txRef)
        .get();

      if (!subscriptionQuery.empty) {
        const subscriptionDoc = subscriptionQuery.docs[0];
        
        // Update subscription to active
        await subscriptionDoc.ref.update({
          status: 'active',
          subscriptionId: transactionData.id,
          flutterwaveTransactionId: transactionData.id,
          startDate: new Date(),
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          lastPaymentDate: new Date(),
          updatedAt: new Date()
        });

        console.log("Subscription activated successfully");
      } else {
        // Fallback: create new subscription record
        console.log("Creating new subscription record");
        
        await dbAdmin.collection('subscriptions').add({
          userId,
          subscriptionId: transactionData.id,
          plan,
          status: 'active',
          txRef,
          amount: transactionData.amount,
          currency: transactionData.currency,
          email: transactionData.customer.email,
          startDate: new Date(),
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          lastPaymentDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          failedPaymentCount: 0
        });

        console.log("New subscription created");
      }
    } else {
      // This is a recurring payment handled by webhook
      console.log("Recurring payment processed via webhook");
    }

    // Update user document with subscription info
    await dbAdmin.collection("users").doc(userId).update({
      plan: plan,
      subscriptionStatus: 'active',
      subscriptionId: transactionData.id,
      storageLimit: getStorageLimit(plan),
      upgradeDate: new Date().toISOString(),
      updatedAt: new Date()
    });

    // Log the payment
    await dbAdmin.collection('payments').add({
      userId,
      flutterwaveTransactionId: transactionData.id,
      amount: transactionData.amount,
      currency: transactionData.currency,
      status: 'successful',
      paymentDate: new Date(),
      type: isInitialSubscription ? 'initial_subscription' : 'recurring',
      plan,
      txRef
    });

    console.log("Subscription payment processed successfully");

  } catch (error) {
    console.error("Error handling subscription payment:", error);
    throw error;
  }
}

// Helper function to get storage limit based on plan
function getStorageLimit(plan: string): number {
  switch (plan.toLowerCase()) {
    case 'pro':
      return 4294967296; // 4GB in bytes
    case 'free':
    default:
      return 1073741824; // 1GB in bytes
  }
}