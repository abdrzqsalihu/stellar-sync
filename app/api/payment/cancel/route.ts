import { NextRequest, NextResponse } from "next/server";

import axios from "axios";
import { dbAdmin } from "../../../../lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch subscription from Firestore
    const subscriptionQuery = await dbAdmin
      .collection("subscriptions")
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (subscriptionQuery.empty) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const subscriptionDoc = subscriptionQuery.docs[0];
    const subscriptionData = subscriptionDoc.data();
    const subscriptionId = subscriptionData.flutterwaveSubscriptionId; // Assumes stored in Firestore

    if (!subscriptionId) {
      // Update Firestore to cancel locally if no Flutterwave subscription
      await subscriptionDoc.ref.update({
        status: "canceled",
        nextPaymentDate: null,
        updatedAt: new Date(),
      });
      console.log(`Canceled local subscription for user ${userId}`);
      return NextResponse.json({ message: "Subscription canceled locally" }, { status: 200 });
    }

    // Call Flutterwave API to cancel subscription
    const response = await axios.post(
      `https://api.flutterwave.com/v3/subscriptions/${subscriptionId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      // Update Firestore
      await subscriptionDoc.ref.update({
        status: "canceled",
        nextPaymentDate: null,
        updatedAt: new Date(),
      });
      console.log(`Canceled subscription ${subscriptionId} for user ${userId}`);
      return NextResponse.json({ message: "Subscription canceled successfully" }, { status: 200 });
    } else {
      console.error("Flutterwave cancellation failed:", response.data);
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}