"use client";

import React from "react";
import { Skeleton } from "./ui/skeleton";
import { usePathname } from "next/navigation";

function FileSkeleton() {
  const pathname = usePathname();
  const shouldShowButtons = pathname === "/dashboard/all-files";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {shouldShowButtons && (
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="group relative flex overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex flex-1 p-4">
                <Skeleton className="mr-4 h-14 w-14 rounded-lg" />

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-12 rounded-full mb-1" />
                      <Skeleton className="h-5 w-32 mb-1" />
                      <div className="mt-1 flex items-center gap-3">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Dropdown menu skeleton */}
              <div className="absolute right-2 top-2">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default FileSkeleton;
