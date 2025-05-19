"use client";

import { Progress } from "../components/ui/progress";
import { HardDrive } from "lucide-react";

export default function StorageStats() {
  // Mock storage data
  const storageUsed = 4.2; // GB
  const storageTotal = 10; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight">Storage</h3>
        <p className="text-sm text-muted-foreground">
          Your cloud storage usage
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5056FD]/10">
            <HardDrive className="h-6 w-6 text-[#5056FD]" />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {storageUsed.toFixed(1)} GB of {storageTotal} GB used
              </span>
              <span className="text-sm font-medium">
                {storagePercentage.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={storagePercentage}
              className="h-2 [&>div]:bg-[#5056FD]"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#5056FD]" />
              <span>Documents</span>
            </div>
            <span>2.1 GB</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
              <span>Images</span>
            </div>
            <span>1.3 GB</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#eab308]" />
              <span>Videos</span>
            </div>
            <span>0.8 GB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
