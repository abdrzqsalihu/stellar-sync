"use client";
import React from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import Link from "next/link";

interface UpgradePlanProps {
  userId: string;
  email: string;
  name: string;
  isPro?: boolean;
}

function UpgradePlan({ userId, email, name, isPro = false }: UpgradePlanProps) {
  if (isPro) {
    return (
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-none tracking-tight">
                Pro Plan Active
              </h3>
              <div className="inline-flex items-center rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 h-3 w-3"
                >
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Active
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You're enjoying all premium features
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 text-primary"
                  >
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span>4GB Storage</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 text-primary"
                  >
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span>Premium Features Unlocked</span>
              </li>
            </ul>
            <Link
              href="/dashboard/subscription"
              className="w-full border-primary/20 hover:bg-primary/5"
            >
              <Button variant="outline" className="w-full mt-5">
                Manage Subscription
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="bg-primary/5 p-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold leading-none tracking-tight">
            Upgrade to Pro
          </h3>
          <p className="text-sm text-muted-foreground">
            Get more storage and premium features
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-primary"
                >
                  <path d="M2 20h20V8H2z" />
                  <path d="M12 4v4" />
                  <path d="M10 4h4" />
                </svg>
              </div>
              <span>4GB Storage</span>
            </li>
          </ul>
          <Button
            onClick={async () => {
              const res = await fetch("/api/payment/subscribe", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId,
                  email,
                  name,
                  amount: 5, // in USD
                  plan: "pro",
                }),
              });

              const data = await res.json();
              if (data.link) {
                window.location.href = data.link;
              } else {
                toast.error(data.error || "Failed to initiate payment");
                // toast.error("Failed to initiate payment");
              }
            }}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}
export default UpgradePlan;
