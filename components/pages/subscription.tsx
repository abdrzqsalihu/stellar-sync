import React from "react";
import SubscriptionOverview from "../subscription-overview";
import BillingHistory from "../billing-history";
import PaymentMethods from "../payment-methods";
import { getEmailFromUserId } from "../../lib/getEmailFromUserId";
import { dbAdmin } from "../../lib/firebase-admin";

interface SubscriptionContentProps {
  userId: string;
}

export default async function SubscriptionContent({
  userId,
}: SubscriptionContentProps) {
  const email = await getEmailFromUserId(userId);
  const userDoc = await dbAdmin.collection("users").doc(userId).get();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription, billing, and payment methods.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <SubscriptionOverview />
          {/* <PlanComparison /> */}
          <BillingHistory />
        </div>

        <div className="space-y-8">
          <PaymentMethods />
        </div>
      </div>
    </div>
  );
}
