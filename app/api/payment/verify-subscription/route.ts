import { NextRequest, NextResponse } from "next/server";
import { handleSubscriptionPayment } from "../../../../lib/subscription-utils";

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

function getStorageLimit(plan: string): number {
  switch (plan.toLowerCase()) {
    case 'pro':
    return 4294967296;
    case 'free':
    default:
    return 1073741824;

  }
}