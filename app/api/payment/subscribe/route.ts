import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";
import { cancelAllPendingSubscriptions } from "../../../../lib/subscription-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, userId, email, plan, name } = body;

    // Debug: Log environment variables (without exposing secrets)
    console.log("Environment check:", {
      hasSecretKey: !!process.env.FLW_SECRET_KEY,
      secretKeyLength: process.env.FLW_SECRET_KEY?.length,
      hasPaymentPlan: !!process.env.FLW_PAYMENT_PLAN_ID,
      paymentPlanId: process.env.FLW_PAYMENT_PLAN_ID,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    });

    if (!process.env.FLW_SECRET_KEY || !process.env.FLW_PAYMENT_PLAN_ID || !process.env.NEXT_PUBLIC_APP_URL) {
      console.error("Missing critical environment variables:", {
        hasSecretKey: !!process.env.FLW_SECRET_KEY,
        hasPaymentPlan: !!process.env.FLW_PAYMENT_PLAN_ID,
        hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL
      });
      return NextResponse.json({ 
        error: "Server configuration error. Missing environment variables." 
      }, { status: 500 });
    }

    if (!plan || plan !== "pro") {
      console.error("Invalid plan provided:", plan);
      return NextResponse.json({ error: "Invalid plan", details: { provided: plan } }, { status: 400 });
    }
    if (!amount || amount !== 5) {
      console.error("Invalid amount provided:", amount);
      return NextResponse.json({ error: "Invalid amount", details: { provided: amount } }, { status: 400 });
    }

    const userDoc = await dbAdmin.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      console.error(`User not found in Firestore: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = userDoc.data().email;
    if (!userEmail || userEmail.toLowerCase() !== email?.toLowerCase()) {
      console.error(`Email mismatch: doc=${userEmail}, provided=${email}`);
      return NextResponse.json({ 
        error: "Email does not match user account",
        details: { expected: userEmail, provided: email }
      }, { status: 400 });
    }

    // Check for any existing ACTIVE subscription
    const existingSubscription = await dbAdmin
      .collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    if (!existingSubscription.empty) {
      console.warn(`User ${userId} already has an active subscription`);
      return NextResponse.json({ 
        error: "User already has an active subscription" 
      }, { status: 400 });
    }

    // Cancel any existing pending subscriptions to avoid accumulation
    await cancelAllPendingSubscriptions(userId);

    const txRef = `sub-${userId}-${Date.now()}`;

    const requestBody = {
      tx_ref: txRef,
      amount,
      currency: "USD",
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify-subscription`,
      payment_options: "card,banktransfer,ussd,paypal",
      customer: { email, name: name || "Customer" },
      payment_plan: process.env.FLW_PAYMENT_PLAN_ID,
      meta: { userId, plan, subscription: true },
      customizations: {
        title: "StellarSync Monthly Plan",
        description: `Subscribe to ${plan} Plan - $5/month`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.png`,
      },
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", res.status);
    console.log("Response headers:", Object.fromEntries(res.headers.entries()));

    // Get response text first to see what we're actually receiving
    const responseText = await res.text();
    console.log("Raw response:", responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response was:", responseText.substring(0, 1000));
      
      // Check if response is HTML (likely an error page)
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
        return NextResponse.json({ 
          error: "Flutterwave API returned HTML instead of JSON. Check your API key and endpoint." 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: "Invalid response from Flutterwave API" 
      }, { status: 500 });
    }

    console.log("Parsed response:", JSON.stringify(data, null, 2));

    if (data.status === 'success') {
      // Store subscription with payment reference
      await dbAdmin.collection('subscriptions').add({
        userId,
        plan,
        status: 'pending',
        paymentPlanId: process.env.FLW_PAYMENT_PLAN_ID,
        txRef,
        createdAt: new Date(),
        amount: 5,
        currency: 'USD',
        email,
        name: name || "Customer",
        flutterwaveData: data.data
      });

      console.log("Subscription created successfully");

      return NextResponse.json({ 
        link: data.data.link
      });
    }

    console.error("Flutterwave error:", data);
    return NextResponse.json({ 
      error: data.message || "Payment initialization failed",
      details: data 
    }, { status: 400 });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}