import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";
import { handleSubscriptionPayment } from "../../../../lib/subscription-utils";


export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const secretHash = process.env.FLW_SECRET_HASH;
    const receivedHash = req.headers.get("verif-hash");
    if (!receivedHash || receivedHash !== secretHash) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload;
    console.log("Webhook received:", {
      event,
      transactionId: data.id,
      txRef: data.tx_ref,
      status: data.status,
    });

    if (event === "charge.completed" && data.status === "successful") {
      const { id: flutterwaveTransactionId, tx_ref: txRef, amount, currency, customer, created_at: paymentDate, meta } = data;
      const userId = meta?.userId || txRef.split("-")[1];
      const plan = meta?.plan || "pro";

      // Check for duplicate transaction
      const paymentRef = dbAdmin.collection("payments").doc(flutterwaveTransactionId.toString());
      const existingPayment = await paymentRef.get();
      if (existingPayment.exists && existingPayment.data().status === "successful") {
        console.log(`Duplicate transaction ${flutterwaveTransactionId}`);
        return NextResponse.json({ message: "Duplicate transaction" }, { status: 200 });
      }

      // Process payment
      await handleSubscriptionPayment(userId, plan, data, txRef);
      console.log(`Processed webhook for transaction ${flutterwaveTransactionId}`);
      return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
    }

    if (event === "charge.completed" && data.status === "failed") {
      const { id: flutterwaveTransactionId, tx_ref: txRef, customer } = data;
      const userId = txRef.split("-")[1];
      await dbAdmin.collection("payments").doc(flutterwaveTransactionId.toString()).set({
        userId,
        flutterwaveTransactionId,
        amount: data.amount || 0,
        currency: data.currency || "USD",
        status: "failed",
        paymentDate: new Date(data.created_at),
        type: txRef.startsWith("sub-") ? "initial_subscription" : "recurring",
        plan: data.meta?.plan || "pro",
        txRef,
        originalCustomer: { email: customer.email, name: customer.name || "Customer" },
        flutterwaveCustomer: customer,
      });
      console.log(`Recorded failed transaction ${flutterwaveTransactionId}`);
      return NextResponse.json({ message: "Failed transaction recorded" }, { status: 200 });
    }
    
    if (event === "subscription.cancelled") {
      const { id: subscriptionId, customer, meta } = data;
      const userId = meta?.userId || customer.email;
      const subscriptionQuery = await dbAdmin
        .collection("subscriptions")
        .where("userId", "==", userId)
        .limit(1)
        .get();
      if (!subscriptionQuery.empty) {
        await subscriptionQuery.docs[0].ref.update({
          status: "canceled",
          nextPaymentDate: null,
          updatedAt: new Date(),
        });
        console.log(`Subscription ${subscriptionId} canceled for user ${userId}`);
      }
      return NextResponse.json({ message: "Subscription cancellation processed" }, { status: 200 });
    }


    console.log(`Received unhandled event: ${event}`);
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}