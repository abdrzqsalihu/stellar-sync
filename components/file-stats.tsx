"use client";

import { FileText, Star, Share2 } from "lucide-react";

export default function FileStats({
  allFilesCount,
  staredFilesCount,
  sharedFilesCount,
}) {
  // stats data
  const stats = [
    {
      title: "All Files",
      count: allFilesCount,
      icon: FileText,
      color: "#5056FD",
      bgColor: "bg-[#5056FD]/10",
      change: "+12% from last month",
      positive: true,
    },
    {
      title: "Starred",
      count: staredFilesCount,
      icon: Star,
      color: "#FFB800",
      bgColor: "bg-[#FFB800]/10",
      change: "+5% from last month",
      positive: true,
    },
    {
      title: "Shared",
      count: sharedFilesCount,
      icon: Share2,
      color: "#00C48C",
      bgColor: "bg-[#00C48C]/10",
      change: "-2% from last month",
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border bg-card p-7 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <h3 className="mt-2 text-3xl font-bold">{stat.count}</h3>
              {/* <p
                className={`mt-1 text-xs ${
                  stat.positive ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </p> */}
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}
            >
              <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
