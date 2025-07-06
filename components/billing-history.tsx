"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, Receipt } from "lucide-react";

interface BillingHistoryEntry {
  paymentId: string;
  amount: number;
  currency: string;
  date: string | null;
  status: string;
  plan: string;
  transactionId: number | null;
  txRef: string | null;
  customerEmail: string | null;
  customerName: string | null;
}

interface SubscriptionData {
  plan: string;
  status: string;
  nextBilling: string | null;
  storageUsed: number;
  storageUsedUnit: string;
  storageLimit: number;
  storageLimitUnit: string;
  remainingStorage: number;
  remainingStorageUnit: string;
  sharedFiles: number;
  sharedLimit: number | string;
  lastPaymentDate?: string | null;
  amount?: number;
  currency?: string;
  billingHistory?: BillingHistoryEntry[];
}

interface BillingHistoryProps {
  subscription: SubscriptionData;
}

export default function BillingHistory({ subscription }: BillingHistoryProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return (
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 bg-green-50"
          >
            Paid
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50"
          >
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-200 bg-yellow-50"
          >
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      {subscription.plan.toLowerCase() === "pro" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-[#5056FD]" />
                  Billing History
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  View and download your past invoices
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {subscription.billingHistory &&
              subscription.billingHistory.length > 0 ? (
                subscription.billingHistory.map((invoice) => (
                  <div
                    key={invoice.paymentId}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5056FD]/10">
                        <Receipt className="h-5 w-5 text-[#5056FD]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">
                            {invoice.plan}
                          </span>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatDate(invoice.date)}</span>
                          <span>•</span>
                          <span>{invoice.paymentId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {invoice.amount.toFixed(2)} {invoice.currency}
                      </span>
                      {invoice.status.toLowerCase() === "successful" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#5056FD] hover:text-[#4045e0]"
                          onClick={() => {
                            window.location.href = `/api/invoice/${invoice.paymentId}`;
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No billing history</h3>
                  <p className="text-sm text-muted-foreground">
                    Your billing history will appear here once you make your
                    first payment.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
