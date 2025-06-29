import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebase-admin";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const txRef = url.searchParams.get("tx_ref");
  const transactionId = url.searchParams.get("transaction_id");
  const status = url.searchParams.get("status");

  console.log("Payment verification params:", { txRef, transactionId, status });
  
  // Check if secret key is available
  if (!process.env.FLW_SECRET_KEY) {
    console.error("FLW_SECRET_KEY environment variable is not set");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
  }
  
  console.log("Secret key available:", !!process.env.FLW_SECRET_KEY);

  // Handle cancelled status first
  if (status === "cancelled") {
    console.log("Payment cancelled, redirecting to dashboard");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=cancelled`);
  }

  // Handle successful status from Flutterwave callback
  if (status === "successful") {
    console.log("Payment successful from callback, proceeding to verify");
    // Continue to verification process below
  }

  // Check for missing required parameters for successful transactions
  if (!transactionId || !txRef) {
    console.log("Missing required parameters, redirecting with failed status");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
  }

  try {
    console.log("Verifying transaction with Flutterwave API");
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
      
      // Log the error response for debugging
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
      console.log("Transaction verified successfully");
      
      // Get user ID from meta data
      const userId = data.data.meta?.userId;
      
      if (!userId) {
        console.error("No userId found in transaction meta data");
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
      }

      console.log("Updating user plan for userId:", userId);
      
      // Update user in database
      await dbAdmin.collection("users").doc(userId).update({
        plan: "pro",
        storageLimit: 4294967296, // 4GB in bytes
        upgradeDate: new Date().toISOString(),
      });

      console.log("User plan updated successfully");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`);
    } else {
      console.log("Transaction verification failed:", data.status, data.data?.status);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failed`);
  }
}