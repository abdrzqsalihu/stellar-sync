"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CalendarClock, CheckCircle2, Clock } from "lucide-react";
import { formatUploadDate } from "./uploaded-at";

type Preset = "none" | "1d" | "7d" | "30d" | "custom";

interface ShareExpiryProps {
  fileId: string;
  initialExpiresAt: string | null;
}

const PRESET_DAYS: Record<"1d" | "7d" | "30d", number> = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
};

export default function ShareExpiry({
  fileId,
  initialExpiresAt,
}: ShareExpiryProps) {
  const router = useRouter();
  const [expiresAt, setExpiresAt] = useState<string | null>(initialExpiresAt);
  const [preset, setPreset] = useState<Preset>(
    initialExpiresAt ? "custom" : "none"
  );
  const [customDate, setCustomDate] = useState("");
  const [saving, setSaving] = useState(false);

  const isExpired = !!expiresAt && new Date(expiresAt).getTime() <= Date.now();

  const statusText = (() => {
    if (!expiresAt) return "This link never expires.";
    const formatted = formatUploadDate(expiresAt) ?? expiresAt;
    return isExpired ? `Expired on ${formatted}` : `Expires on ${formatted}`;
  })();

  const save = async () => {
    let nextValue: string | null;

    if (preset === "none") {
      nextValue = null;
    } else if (preset === "custom") {
      if (!customDate) {
        toast.error("Please choose a custom expiration date");
        return;
      }
      const parsed = new Date(customDate);
      if (isNaN(parsed.getTime())) {
        toast.error("That date doesn't look valid");
        return;
      }
      if (parsed.getTime() <= Date.now()) {
        toast.error("Expiration must be set in the future");
        return;
      }
      nextValue = parsed.toISOString();
    } else {
      nextValue = new Date(
        Date.now() + PRESET_DAYS[preset] * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareExpiresAt: nextValue }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update expiration");
      }
      setExpiresAt(nextValue);
      toast.success(
        nextValue ? "Expiration updated" : "Link set to never expire"
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update expiration"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm">
      <CardContent className="p-6 space-y-5">
        <div className="space-y-2">
          <h3 className="font-medium">Link Expiration</h3>
          <p className="text-sm text-muted-foreground">
            Choose when this shared link stops working.
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
            isExpired
              ? "border-red-200 bg-red-50 text-red-600"
              : expiresAt
              ? "border-[#5056FD]/20 bg-[#5056FD]/5 text-[#5056FD]"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {isExpired ? (
            <Clock className="h-4 w-4 shrink-0" />
          ) : expiresAt ? (
            <CalendarClock className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          )}
          <span>{statusText}</span>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Set new expiration</Label>
          <Select value={preset} onValueChange={(v) => setPreset(v as Preset)}>
            <SelectTrigger className="rounded-lg border-[#5056FD]/20 focus:ring-[#5056FD]/20">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No expiration</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="custom">Custom date</SelectItem>
            </SelectContent>
          </Select>

          {preset === "custom" && (
            <Input
              type="datetime-local"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              min={new Date(Date.now() + 60 * 1000)
                .toISOString()
                .slice(0, 16)}
              className="rounded-lg border-[#5056FD]/20 focus-visible:ring-[#5056FD]/20"
            />
          )}

          <Button
            onClick={save}
            disabled={saving}
            className="w-full rounded-lg bg-[#5056FD] hover:bg-[#4045e0]"
          >
            {saving ? "Saving..." : "Save Expiry Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
