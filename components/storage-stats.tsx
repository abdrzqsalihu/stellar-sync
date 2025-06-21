"use client";

import { Progress } from "../components/ui/progress";
import { HardDrive } from "lucide-react";

interface File {
  id: string;
  fileSize: number;
  type: string;
  [key: string]: any;
}

interface StorageStatsProps {
  files: File[];
  totalStorage: number;
}

export default function StorageStats({
  files,
  totalStorage,
}: StorageStatsProps) {
  console.log(files);

  const bytesToMB = (bytes: number) => bytes / 1_048_576;
  const bytesToGB = (bytes: number) => bytes / 1_073_741_824;

  // Calculate total storage used
  const storageUsed = files.reduce(
    (total, file) => total + (file.fileSize || 0),
    0
  );
  const storageUsedMB = bytesToMB(storageUsed).toFixed(2);
  const storagePercentage = (
    (storageUsed / (totalStorage * 1_073_741_824)) *
    100
  ).toFixed(2);

  // Calculate storage by file type
  const storageByType = files.reduce(
    (acc, file) => {
      const fileType = file.fileType?.toLowerCase() || "other";
      let category: string;
      if (
        [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(fileType)
      ) {
        category = "Documents";
      } else if (["image/jpeg", "image/png", "image/gif"].includes(fileType)) {
        category = "Images";
      } else if (
        ["video/mp4", "video/avi", "video/quicktime"].includes(fileType)
      ) {
        category = "Videos";
      } else {
        category = "Other";
      }
      acc[category] = (acc[category] || 0) + (file.fileSize || 0);
      return acc;
    },
    { Documents: 0, Images: 0, Videos: 0, Other: 0 } as Record<string, number>
  );

  // Format storage by type dynamically (GB if > 1 GB, else MB)
  const storageByTypeFormatted = Object.entries(storageByType).reduce(
    (acc, [type, size]) => {
      if (size >= 1_073_741_824) {
        // More than 1 GB
        acc[type] = {
          value: bytesToGB(size).toFixed(2),
          unit: "GB",
        };
      } else {
        // Less than 1 GB, use MB
        acc[type] = {
          value: bytesToMB(size).toFixed(2),
          unit: "MB",
        };
      }
      return acc;
    },
    {} as Record<string, { value: string; unit: string }>
  );

  // Define colors for each file type
  const typeColors: Record<string, string> = {
    Documents: "#5056FD",
    Images: "#22c55e",
    Videos: "#eab308",
    Other: "#6b7280",
  };

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
                {storageUsedMB} MB of {totalStorage} GB used
              </span>
              <span className="text-sm font-medium">{storagePercentage}%</span>
            </div>
            <Progress
              value={Number(storagePercentage)}
              className="h-2 [&>div]:bg-[#5056FD]"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {Object.entries(storageByTypeFormatted).map(
            ([type, { value, unit }]) => (
              <div
                key={type}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: typeColors[type] }}
                  />
                  <span>{type}</span>
                </div>
                <span>
                  {value} {unit}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
