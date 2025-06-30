"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Calendar, Crown, HardDrive, Users, Zap } from "lucide-react";

export default function SubscriptionOverview() {
  // Mock subscription data
  const subscription = {
    plan: "Free",
    status: "active",
    nextBilling: "2024-02-15",
    storageUsed: 1.2,
    storageLimit: 4,
    filesCount: 128,
    filesLimit: 1000,
    sharedFiles: 36,
    sharedLimit: 100,
  };

  const storagePercentage =
    (subscription.storageUsed / subscription.storageLimit) * 100;
  const filesPercentage =
    (subscription.filesCount / subscription.filesLimit) * 100;
  const sharedPercentage =
    (subscription.sharedFiles / subscription.sharedLimit) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#5056FD]/10 to-[#5056FD]/5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5056FD]">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Current Plan</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-[#5056FD]/10 text-[#5056FD] hover:bg-[#5056FD]/20"
                >
                  {subscription.plan}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-200 bg-green-50"
                >
                  {subscription.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button className="bg-[#5056FD] hover:bg-[#4045e0]">
            <Zap className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Storage Usage */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-[#5056FD]" />
              <span className="text-sm font-medium">Storage</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{subscription.storageUsed} GB used</span>
                <span className="text-muted-foreground">
                  {subscription.storageLimit} GB
                </span>
              </div>
              <Progress value={storagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {(subscription.storageLimit - subscription.storageUsed).toFixed(
                  1
                )}{" "}
                GB remaining
              </p>
            </div>
          </div>

          {/* Shared Files */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#5056FD]" />
              <span className="text-sm font-medium">Shared</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{subscription.sharedFiles} shared</span>
                <span className="text-muted-foreground">
                  {subscription.sharedLimit} limit
                </span>
              </div>
              <Progress value={sharedPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {subscription.sharedLimit - subscription.sharedFiles} shares
                remaining
              </p>
            </div>
          </div>
        </div>

        {subscription.plan === "Free" && (
          <div className="mt-6 p-4 bg-[#5056FD]/5 rounded-lg border border-[#5056FD]/10">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-[#5056FD] mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Ready to unlock more?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Upgrade to Pro for unlimited storage, advanced sharing
                  options, and priority support.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
