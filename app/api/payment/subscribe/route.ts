import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { amount, userId, email, plan, name } = await req.json();

    if (plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (amount !== 5) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const userDoc = await dbAdmin.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (userDoc.data().email !== email) {
      return NextResponse.json({ error: "Email does not match user account" }, { status: 400 });
    }

    const existingSubscription = await dbAdmin
      .collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    if (!existingSubscription.empty) {
      return NextResponse.json({ error: "User already has an active subscription" }, { status: 400 });
    }

    const paymentPlanId = process.env.FLW_PAYMENT_PLAN_ID;
    const txRef = `sub-${userId}-${Date.now()}`;

    const requestBody = {
      tx_ref: txRef,
      amount,
      currency: "USD",
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify-subscription`,
      payment_options: "card,banktransfer,ussd,paypal",
      customer: { email, name: name || "Customer" },
      payment_plan: paymentPlanId,
      meta: { userId, plan, subscription: true },
      customizations: {
        title: "StellarSync Monthly Plan",
        description: `Subscribe to ${plan} Plan - $5/month`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.png`,
      },
    };

    console.log("Sending to Flutterwave:", JSON.stringify(requestBody, null, 2));

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();
    console.log("Flutterwave response:", JSON.stringify(data, null, 2));

    if (data.status === 'success') {
      await dbAdmin.collection('subscriptions').add({
        userId,
        plan,
        status: 'pending',
        txRef,
        createdAt: new Date(),
        amount: 5,
        currency: 'USD',
        email,
        name: name || "Customer",
      });

      console.log("Pending subscription stored in Firestore:", { userId, txRef });
      return NextResponse.json({ link: data?.data?.link });
    }

    console.error("Flutterwave error:", data.message);
    return NextResponse.json({ error: data.message }, { status: 400 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}