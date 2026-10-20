import Link from "next/link";
import { Clock, FileX } from "lucide-react";
import { formatUploadDate } from "../../../../components/uploaded-at";

interface ExpiredLinkProps {
  reason: "expired" | "not-found";
  expiresAt?: string | null;
}

export default function ExpiredLink({ reason, expiresAt }: ExpiredLinkProps) {
  const isExpired = reason === "expired";
  const formatted = expiresAt ? formatUploadDate(expiresAt) : null;

  return (
    <div className="p-8 rounded-md bg-white flex flex-col items-center gap-3 max-w-[420px] mx-auto text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        {isExpired ? (
          <Clock className="h-7 w-7 text-red-500" />
        ) : (
          <FileX className="h-7 w-7 text-red-500" />
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-800">
        {isExpired ? "This link has expired" : "File not found"}
      </h2>
      <p className="text-sm text-gray-500">
        {isExpired
          ? formatted
            ? `Access to this file ended on ${formatted}. Ask the sender for a new link.`
            : "Access to this file has ended. Ask the sender for a new link."
          : "This link is invalid or the file has been removed."}
      </p>

      <Link
        href="/"
        className="mt-2 text-sm font-medium text-[#5056FD] hover:underline"
      >
        Go to Stellar Sync
      </Link>
    </div>
  );
}
