"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

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
}

interface PaymentMethodsProps {
  subscription: SubscriptionData;
}

export default function PaymentMethods({
  subscription: { nextBilling, amount, currency, plan },
}: PaymentMethodsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Next Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Next billing date
              </span>
              <span className="font-medium">
                {nextBilling
                  ? new Date(nextBilling).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-medium">
                {amount} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="font-medium capitalize">{plan}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
      {plan === "pro" ? (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Cancel Subscription</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you cancel, you'll lose access to all premium features at
                  the end of your billing period.
                </p>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
