import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";
import { handleSubscriptionPayment } from "../../../../lib/subscription-utils";

/**
 * Handle incoming Flutterwave webhook POST requests and process payment and subscription events.
 *
 * Processes verified webhook payloads (expects `verif-hash` header matching FLW_SECRET_HASH) and branches by event:
 * - Records or rejects duplicate successful charges, invokes subscription handling for new successful payments.
 * - Records failed charges.
 * - Marks subscriptions cancelled or activated and updates corresponding user/subscription records.
 *
 * @param req - Incoming NextRequest containing the Flutterwave webhook JSON payload and headers (expects `verif-hash`)
 * @returns A NextResponse with a JSON body containing a `message` or `error` describing the outcome and an appropriate HTTP status code
 */
export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const secretHash = process.env.FLW_SECRET_HASH;
    const receivedHash = req.headers.get("verif-hash");
    if (!receivedHash || receivedHash !== secretHash) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload;
    
    console.log("Webhook received:", {
      event,
      transactionId: data.id,
      txRef: data.tx_ref,
      status: data.status,
      paymentPlan: data.payment_plan || 'none'
    });

    // Handle successful payments
    if (event === "charge.completed" && data.status === "successful") {
      const { 
        id: flutterwaveTransactionId, 
        tx_ref: txRef, 
        amount, 
        currency, 
        customer, 
        created_at: paymentDate, 
        meta,
        payment_plan 
      } = data;

      const userId = meta?.userId || txRef.split("-")[1];
      const plan = meta?.plan || "pro";

      console.log(`Processing charge for user ${userId}, txId: ${flutterwaveTransactionId}`);

      // CRITICAL: Check if this exact transaction was already processed
      const paymentRef = dbAdmin.collection("payments").doc(flutterwaveTransactionId.toString());
      const existingPayment = await paymentRef.get();
      
      if (existingPayment.exists) {
        console.log(`DUPLICATE: Transaction ${flutterwaveTransactionId} already exists in database`);
        return NextResponse.json({ message: "Duplicate transaction already processed" }, { status: 200 });
      }

      // Check if user already has a payment recorded for this month
      const currentMonth = new Date(paymentDate).toISOString().slice(0, 7); // YYYY-MM
      const monthlyPayments = await dbAdmin
        .collection("payments")
        .where("userId", "==", userId)
        .where("billingMonth", "==", currentMonth)
        .where("status", "==", "successful")
        .get();

      if (!monthlyPayments.empty) {
        console.log(`DUPLICATE: User ${userId} already has a successful payment in ${currentMonth}`);
        console.log(`Existing transaction ID: ${monthlyPayments.docs[0].data().flutterwaveTransactionId}`);
        console.log(`New transaction ID: ${flutterwaveTransactionId}`);
        return NextResponse.json({ message: "Monthly payment already processed" }, { status: 200 });
      }

      // This is a NEW valid payment - process it
      console.log(`NEW PAYMENT: Processing transaction ${flutterwaveTransactionId} for user ${userId}`);
      
      try {
        await handleSubscriptionPayment(userId, plan, data, txRef);
        console.log(`Successfully processed payment ${flutterwaveTransactionId}`);
        return NextResponse.json({ message: "Payment processed successfully" }, { status: 200 });
      } catch (paymentError) {
        console.error(`Error processing payment ${flutterwaveTransactionId}:`, paymentError);
        // Don't re-throw - Flutterwave will retry if we return 500
        return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
      }
    }

    // Handle failed payments
    if (event === "charge.completed" && data.status === "failed") {
      const { id: flutterwaveTransactionId, tx_ref: txRef, customer } = data;
      const userId = txRef.split("-")[1];
      
      console.log(`FAILED CHARGE: Transaction ${flutterwaveTransactionId} failed for user ${userId}`);

      await dbAdmin.collection("payments").doc(flutterwaveTransactionId.toString()).set({
        userId,
        flutterwaveTransactionId,
        amount: data.amount || 0,
        currency: data.currency || "USD",
        status: "failed",
        paymentDate: new Date(data.created_at),
        type: "failed",
        plan: data.meta?.plan || "pro",
        txRef,
        originalCustomer: { email: customer.email, name: customer.name || "Customer" },
        flutterwaveCustomer: customer,
        createdAt: new Date(),
      });
      
      return NextResponse.json({ message: "Failed transaction recorded" }, { status: 200 });
    }
    
    // Handle subscription cancellation
    if (event === "subscription.cancelled") {
      const { id: subscriptionId, customer, meta } = data;
      const userId = meta?.userId || customer.email;
      
      console.log(`SUBSCRIPTION CANCELLED: ${subscriptionId} for user ${userId}`);
      
      const subscriptionQuery = await dbAdmin
        .collection("subscriptions")
        .where("userId", "==", userId)
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
          plan: "free",
          subscriptionStatus: "cancelled",
          updatedAt: new Date(),
        });
        
        console.log(`Subscription marked as cancelled for user ${userId}`);
      }
      
      return NextResponse.json({ message: "Subscription cancellation processed" }, { status: 200 });
    }

    // Handle subscription activated (when recurring payment plan is created)
    if (event === "subscription.activated") {
      const { id: subscriptionId, customer, meta } = data;
      const userId = meta?.userId;

      console.log(`SUBSCRIPTION ACTIVATED: ${subscriptionId} for user ${userId}`);

      if (userId) {
        const subscriptionQuery = await dbAdmin
          .collection("subscriptions")
          .where("userId", "==", userId)
          .limit(1)
          .get();

        if (!subscriptionQuery.empty) {
          await subscriptionQuery.docs[0].ref.update({
            status: "active",
            flutterwaveSubscriptionId: subscriptionId,
            paymentPlanId: subscriptionId, // Store the payment plan ID to track recurring payments
            activatedAt: new Date(),
            updatedAt: new Date(),
          });

          await dbAdmin.collection("users").doc(userId).update({
            subscriptionStatus: "active",
            subscriptionPlan: "pro",
            subscriptionId: subscriptionId,
            updatedAt: new Date(),
          });

          console.log(`Subscription activated and stored for user ${userId}`);
        } else {
          console.warn(`No subscription found to activate for user ${userId}`);
        }
      } else {
        console.warn(`No userId found in subscription.activated event`);
      }

      return NextResponse.json({ message: "Subscription activation processed" }, { status: 200 });
    }

    console.log(`Unhandled webhook event: ${event}`);
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}