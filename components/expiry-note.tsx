"use client";

import { formatUploadDate } from "./uploaded-at";

// Small status line shown on shared file cards: "Expires <date>" or "Expired <date>".
// Renders nothing when the file has no configured expiration.
export default function ExpiryNote({
  shareExpiresAt,
}: {
  shareExpiresAt?: string | null;
}) {
  if (!shareExpiresAt) return null;
  const isExpired = new Date(shareExpiresAt).getTime() <= Date.now();

  return (
    <p
      className={`mt-1 text-[11px] ${
        isExpired ? "text-red-500" : "text-muted-foreground"
      }`}
    >
      {isExpired ? "Expired " : "Expires "}
      {formatUploadDate(shareExpiresAt) ?? ""}
    </p>
  );
}
