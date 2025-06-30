import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
  const { amount, userId, email, plan } = await req.json();

  if (plan !== "pro") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  if (amount !== 5) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  // Check if user already has an active subscription
    const existingSubscription = await dbAdmin
      .collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    if (!existingSubscription.empty) {
      return NextResponse.json({ 
        error: "User already has an active subscription" 
      }, { status: 400 });
    }

const paymentPlanId = process.env.FLW_PAYMENT_PLAN_ID; 
  const res = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    },
    body: JSON.stringify({
      tx_ref: `${userId}-${Date.now()}`,
      amount,
      currency: "USD",
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify-subscription`,
      payment_options: "card",
      customer: { email },
      payment_plan: paymentPlanId,
      meta: { userId, plan, subscription: true  },
      customizations: {
        title: "Monthly Subscription",
        description: `Subscribe to ${plan} Plan - $5/month`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.png`,
      },
    }),
  });

  const data = await res.json();

  if (data.status === 'success') {
      // Store pending subscription in Firebase
      await dbAdmin.collection('subscriptions').add({
        userId,
        plan,
        status: 'pending',
        txRef: `sub-${userId}-${Date.now()}`,
        createdAt: new Date(),
        amount: 5,
        currency: 'USD',
        email
      });

      return NextResponse.json({ link: data?.data?.link });
    }

    return NextResponse.json({ error: data.message }, { status: 400 });

     } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
