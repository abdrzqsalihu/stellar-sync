import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";
import { cancelAllPendingSubscriptions } from "../../../../lib/subscription-utils";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }
    
    console.log("Incoming request body:", JSON.stringify(body, null, 2));
    const { userId, email, plan, name } = body;
    let { amount } = body;

    // Get user's country from Vercel headers
    let country = req.headers.get("x-vercel-ip-country") || "US";
    
    // For local development testing, you can uncomment the line below:
    // if (process.env.NODE_ENV === 'development') country = 'NG';

    const isNigeria = country === "NG";
    
    const currency = isNigeria ? "NGN" : "USD";
    const paymentPlanId = isNigeria 
      ? (process.env.FLW_PAYMENT_PLAN_ID_NGN || process.env.FLW_PAYMENT_PLAN_ID) 
      : process.env.FLW_PAYMENT_PLAN_ID;

    console.log(`Payment details: Country=${country}, Currency=${currency}, Plan=${paymentPlanId}`);

    // Debug: Log environment variables (without exposing secrets)
    const secretKey = (process.env.FLW_SECRET_KEY || "").trim().replace(/^["']|["']$/g, "");
    const isVercelPreview = !!process.env.VERCEL_URL && !process.env.VERCEL_URL.includes("-prod-");

    console.log("Environment check:", {
      hasSecretKey: !!secretKey,
      secretKeyLength: secretKey.length,
      secretKeyPrefix: secretKey.substring(0, 7), // e.g., FLWSECK
      secretKeySuffix: secretKey.length > 4 ? secretKey.substring(secretKey.length - 4) : "****",
      hasPaymentPlan: !!process.env.FLW_PAYMENT_PLAN_ID,
      paymentPlanId: paymentPlanId,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV,
      isVercelPreview
    });

    if (!secretKey || !paymentPlanId || !process.env.NEXT_PUBLIC_APP_URL) {
      console.error("Missing critical environment variables:", {
        hasSecretKey: !!secretKey,
        hasPaymentPlan: !!paymentPlanId,
        hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
        isVercelPreview
      });
      return NextResponse.json({ 
        error: `Server configuration error. ${isVercelPreview ? "This is a Vercel Preview deployment - check if your environment variables are enabled for 'Preview' scope." : "Check your Vercel Environment Variables."}`,
        details: { isVercelPreview, hasSecretKey: !!secretKey }
      }, { status: 500 });
    }

    if (!secretKey.startsWith("FLWSECK")) {
      console.error("Invalid Secret Key format: Does not start with FLWSECK");
      return NextResponse.json({ 
        error: "FLW_SECRET_KEY is incorrectly formatted. It must start with 'FLWSECK' or 'FLWSECK_TEST'." 
      }, { status: 500 });
    }

    if (!plan || plan !== "pro") {
      console.error("Invalid plan provided:", plan);
      return NextResponse.json({ error: "Invalid plan", details: { provided: plan } }, { status: 400 });
    }
    
    // Set amount based on currency
    if (isNigeria) {
      amount = 7000;
    } else {
      amount = 5;
    }

    const userDoc = await dbAdmin.collection('users').doc(userId || 'unknown').get();
    if (!userDoc.exists) {
      console.error(`User not found in Firestore: ${userId}`);
      return NextResponse.json({ 
        error: "User account record not found. Please ensure you are logged in and your profile is created.",
        details: { userId }
      }, { status: 404 });
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
      currency,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify-subscription`,
      payment_options: "card,banktransfer,ussd,paypal",
      customer: { email, name: name || "Customer" },
      payment_plan: paymentPlanId,
      meta: { userId, plan, subscription: true },
      customizations: {
        title: "StellarSync Monthly Plan",
        description: `Subscribe to ${plan} Plan - ${currency} ${amount}/month`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/favicon.png`,
      },
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secretKey}`,
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    console.log("Flutterwave Response Status:", res.status);
    const responseText = await res.text();
    
    if (!res.ok && (responseText.includes('<!DOCTYPE') || responseText.includes('<html>'))) {
      console.error("Flutterwave returned HTML error:", responseText.substring(0, 500));
      return NextResponse.json({ 
        error: `Flutterwave API returned an HTML error page (Status: ${res.status}). This usually indicates a configuration issue, an invalid endpoint, or a WAF block.`,
        status: res.status,
        preview: responseText.substring(0, 200)
      }, { status: 500 });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json({ 
        error: "Invalid JSON response from Flutterwave",
        status: res.status,
        preview: responseText.substring(0, 200)
      }, { status: 500 });
    }

    console.log("Parsed response:", JSON.stringify(data, null, 2));

    if (data.status === 'success') {
      // Store subscription with payment reference
      await dbAdmin.collection('subscriptions').add({
        userId,
        plan,
        status: 'pending',
        paymentPlanId,
        txRef,
        createdAt: new Date(),
        amount,
        currency,
        email,
        name: name || "Customer",
        flutterwaveData: data.data,
        countryDetected: country
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