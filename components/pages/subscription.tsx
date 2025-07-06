import { dbAdmin } from "../../lib/firebase-admin";
import SubscriptionOverview from "../subscription-overview";
import BillingHistory from "../billing-history";
import PaymentMethods from "../payment-methods";
import { getEmailFromUserId } from "../../lib/getEmailFromUserId";

interface SubscriptionContentProps {
  userId: string;
}

export default async function SubscriptionContent({
  userId,
}: SubscriptionContentProps) {
  const email = await getEmailFromUserId(userId);
  const userDoc = await dbAdmin.collection("users").doc(userId).get();

  // Fetch subscription data
  const subscriptionQuery = await dbAdmin
    .collection("subscriptions")
    .where("userId", "==", userId)
    .limit(1)
    .get();

  // Fetch payment data for billingHistory
  const paymentsSnap = await dbAdmin
    .collection("payments")
    .where("userId", "==", userId)
    .orderBy("paymentDate", "desc")
    .limit(10)
    .get();

  const billingHistory = paymentsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      paymentId: data.flutterwaveTransactionId.toString(),
      amount: data.amount || 0,
      currency: data.currency || "USD",
      date: data.paymentDate ? data.paymentDate.toDate().toISOString() : null,
      status: data.status || "successful",
      plan: data.plan || "Free",
      transactionId: data.flutterwaveTransactionId || null,
      txRef: data.txRef || null,
      customerEmail: data.originalCustomer?.email || null,
      customerName: data.originalCustomer?.name || null,
    };
  });

  // Get user's files for shared files count
  let files: Array<any> = [];
  const base = dbAdmin
    .collection("uploadedFiles")
    .where("userEmail", "==", email);
  const snap = await base.get();
  snap.forEach((d) => files.push({ id: d.id, ...d.data() }));

  // Get user data and storage info
  const userData = userDoc.exists ? userDoc.data() : null;
  let storageUsedBytes = userData?.storageUsed ?? 0;
  const storageLimitBytes = userData?.storageLimit ?? 1073741824; // Default 1GB

  // Validate storageUsed to prevent invalid values
  const MAX_REASONABLE_STORAGE_MB = 4 * 1024; // 4 GB in MB
  if (
    storageUsedBytes / (1024 * 1024) > MAX_REASONABLE_STORAGE_MB ||
    storageUsedBytes < 0
  ) {
    console.warn(
      `Invalid storageUsed for user ${userId}: ${storageUsedBytes} bytes. Resetting to 0.`
    );
    storageUsedBytes = 0;
  }

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

  // Determine display unit
  let storageUsedDisplay,
    storageUsedUnit,
    storageLimitDisplay,
    storageLimitUnit;
  if (storageUsedGB < 1) {
    storageUsedDisplay = storageUsedMB;
    storageUsedUnit = "MB";
    storageLimitDisplay = storageLimitGB >= 1 ? storageLimitGB : storageLimitMB;
    storageLimitUnit = storageLimitGB >= 1 ? "GB" : "MB";
  } else {
    storageUsedDisplay = storageUsedGB;
    storageUsedUnit = "GB";
    storageLimitDisplay = storageLimitGB;
    storageLimitUnit = "GB";
  }

  // Calculate remaining storage
  const remainingStorageBytes = Math.max(
    0,
    storageLimitBytes - storageUsedBytes
  );
  const remainingStorageMB = remainingStorageBytes / (1024 * 1024);
  const remainingStorageGB = remainingStorageMB / 1024;

  let remainingStorageDisplay, remainingStorageUnit;
  if (storageUsedUnit === "MB") {
    remainingStorageDisplay = remainingStorageMB;
    remainingStorageUnit = "MB";
  } else {
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

  let subscriptionData;

  if (!subscriptionQuery.empty) {
    const subscriptionDoc = subscriptionQuery.docs[0].data();
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
      billingHistory,
    };
  } else {
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
      billingHistory: [],
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
          <BillingHistory subscription={subscriptionData} />
        </div>

        <div className="space-y-8">
          <PaymentMethods subscription={subscriptionData} />
        </div>
      </div>
    </div>
  );
}
