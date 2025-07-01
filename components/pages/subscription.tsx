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

  // Fetch subscription data from subscriptions collection
  const subscriptionQuery = await dbAdmin
    .collection("subscriptions")
    .where("userId", "==", userId)
    .limit(1)
    .get();

  let subscriptionData;

  // Get user's files for shared files count
  let files: Array<any> = [];
  const base = dbAdmin
    .collection("uploadedFiles")
    .where("userEmail", "==", email);
  const snap = await base.get();
  snap.docs.forEach((d) => files.push({ id: d.id, ...d.data() }));

  // Get user data and storage info
  const userData = userDoc.exists ? userDoc.data() : null;
  const storageUsedBytes = userData?.storageUsed ?? 0;
  const storageLimitBytes = userData?.storageLimit ?? 1073741824; // default 1GB

  // Get plan from user data or subscription
  let currentPlan = userData?.plan || "free";
  if (!subscriptionQuery.empty) {
    const subscriptionDoc = subscriptionQuery.docs[0].data();
    currentPlan = subscriptionDoc.plan || currentPlan;
  }

  // Convert bytes to MB and GB
  const storageUsedMB = storageUsedBytes / (1024 * 1024);
  const storageUsedGB = storageUsedMB / 1024;
  const storageLimitMB = storageLimitBytes / (1024 * 1024);
  const storageLimitGB = storageLimitMB / 1024;

  // Determine display unit - show MB if usage is under 1GB for better user understanding
  let storageUsedDisplay,
    storageUsedUnit,
    storageLimitDisplay,
    storageLimitUnit;
  if (storageUsedGB < 1) {
    // Show in MB if usage is under 1GB
    storageUsedDisplay = storageUsedMB;
    storageUsedUnit = "MB";
    // Show limit in GB if it's 1GB or more, otherwise MB
    if (storageLimitGB >= 1) {
      storageLimitDisplay = storageLimitGB;
      storageLimitUnit = "GB";
    } else {
      storageLimitDisplay = storageLimitMB;
      storageLimitUnit = "MB";
    }
  } else {
    // Show everything in GB if usage is 1GB or more
    storageUsedDisplay = storageUsedGB;
    storageUsedUnit = "GB";
    storageLimitDisplay = storageLimitGB;
    storageLimitUnit = "GB";
  }

  // Calculate remaining storage in appropriate units
  const remainingStorageBytes = Math.max(
    0,
    storageLimitBytes - storageUsedBytes
  );
  const remainingStorageMB = remainingStorageBytes / (1024 * 1024);
  const remainingStorageGB = remainingStorageMB / 1024;

  let remainingStorageDisplay, remainingStorageUnit;
  if (storageUsedUnit === "MB") {
    // If showing usage in MB, show remaining in MB too
    remainingStorageDisplay = remainingStorageMB;
    remainingStorageUnit = "MB";
  } else {
    // If showing usage in GB, show remaining in GB
    remainingStorageDisplay = remainingStorageGB;
    remainingStorageUnit = "GB";
  }

  // Calculate shared files count
  const sharedFilesCount = files.filter(
    (file) =>
      file.shared ||
      file.isShared ||
      (file.sharedWith && file.sharedWith.length > 0)
  ).length;

  if (!subscriptionQuery.empty) {
    const subscriptionDoc = subscriptionQuery.docs[0].data();

    // Map your Firestore data to the component structure
    subscriptionData = {
      plan: subscriptionDoc.plan || "free",
      status: subscriptionDoc.status || "active",
      nextBilling: subscriptionDoc.nextPaymentDate
        ? subscriptionDoc.nextPaymentDate.toDate().toISOString()
        : null,
      storageUsed: Number(storageUsedDisplay.toFixed(2)),
      storageUsedUnit: storageUsedUnit,
      storageLimit: Number(storageLimitDisplay.toFixed(2)),
      storageLimitUnit: storageLimitUnit,
      remainingStorage: Number(remainingStorageDisplay.toFixed(2)),
      remainingStorageUnit: remainingStorageUnit,
      sharedFiles: sharedFilesCount,
      sharedLimit: subscriptionDoc.plan === "pro" ? "Unlimited" : 100,
      lastPaymentDate: subscriptionDoc.lastPaymentDate
        ? subscriptionDoc.lastPaymentDate.toDate().toISOString()
        : null,
      amount: subscriptionDoc.amount || 0,
      currency: subscriptionDoc.currency || "USD",
    };
  } else {
    // Default free plan data if no subscription found
    subscriptionData = {
      plan: "free",
      status: "active",
      nextBilling: null,
      storageUsed: Number(storageUsedDisplay.toFixed(2)),
      storageUsedUnit: storageUsedUnit,
      storageLimit: Number(storageLimitDisplay.toFixed(2)),
      storageLimitUnit: storageLimitUnit,
      remainingStorage: Number(remainingStorageDisplay.toFixed(2)),
      remainingStorageUnit: remainingStorageUnit,
      sharedFiles: sharedFilesCount,
      sharedLimit: 100,
      lastPaymentDate: null,
      amount: 0,
      currency: "USD",
    };
  }

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
          <SubscriptionOverview subscription={subscriptionData} />
          {/* <PlanComparison /> */}
          <BillingHistory subscription={subscriptionData} />
        </div>

        <div className="space-y-8">
          <PaymentMethods subscription={subscriptionData} />
        </div>
      </div>
    </div>
  );
}
