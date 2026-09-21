"use client";

import { useEffect, useState } from "react";

// Formats an ISO timestamp in the viewer's local timezone, e.g. "Sep 21, 2026, 3:47 PM".
// Returns null for missing or invalid values.
export function formatUploadDate(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(value as string);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function UploadedAt({ value }: { value: unknown }) {
  // Format after mount so the browser's timezone is used and SSR output can't mismatch
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(formatUploadDate(value) ?? "");
  }, [value]);

  if (text === null) return null;
  return <>{text ? `Uploaded ${text}` : "Upload date unavailable"}</>;
}
