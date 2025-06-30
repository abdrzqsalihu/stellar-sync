"use client";

import { CreditCard, Plus, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function PaymentMethods() {
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
              <span className="font-medium">February 15, 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="font-medium">Free</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
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
    </div>
  );
}
