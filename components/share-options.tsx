"use client";

import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Send,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface ShareOptionsProps {
  fileId: string;
}

export default function ShareOptions({ fileId }: ShareOptionsProps) {
  const { user } = useUser();
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [savedPassword, setSavedPassword] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(true);

  useEffect(() => {
    // Fetch initial password status
    const checkPasswordStatus = async () => {
      try {
        setIsLoadingPassword(true);
        const response = await fetch(`/api/files/${fileId}`);
        const data = await response.json();
        if (data.password) {
          setHasPassword(true);
          setPasswordProtected(true);
          setSavedPassword(data.password);
        }
      } catch (error) {
        console.error("Error checking password status:", error);
      } finally {
        setIsLoadingPassword(false);
      }
    };
    checkPasswordStatus();
  }, [fileId]);

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://stellar-sync.vercel.app/preview/${fileId}`
    );
    toast.success("File link copied to clipboard");
  };

  // Replace your sendEmail function with this:
  const sendEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      // Show loading state
      toast.loading("Sending email...", { id: "sending-email" });

      const senderName =
        user?.fullName || user?.firstName || user?.username || "Someone";

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          fileId: fileId,
          password: hasPassword ? savedPassword : null,
          senderName: senderName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      // Dismiss loading toast and show success
      toast.dismiss("sending-email");
      toast.success(`File link sent to ${email}!`);
      setEmail("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.dismiss("sending-email");
      toast.error(
        error instanceof Error ? error.message : "Failed to send email"
      );
    }
  };

  const setFilePassword = async () => {
    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Failed to set password");
      }

      toast.success("Password protection enabled!");
      setHasPassword(true);
      setSavedPassword(password);
      setPassword("");
      setShowPassword(false);
    } catch (error) {
      toast.error("Failed to set password");
      console.error(error);
    }
  };

  const removePassword = async () => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: "" }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove password");
      }

      toast.success("Password protection removed!");
      setHasPassword(false);
      setPasswordProtected(false);
      setSavedPassword("");
      setPassword("");
      setShowPassword(false);
    } catch (error) {
      toast.error("Failed to remove password");
      console.error(error);
    }
  };

  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm font-medium">
              Share Link
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="link"
                  value={`https://stellar-sync.vercel.app/preview/${fileId}`}
                  readOnly
                  className="pr-10 rounded-lg border-[#5056FD]/20 focus-visible:ring-[#5056FD]/20"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyLink}
                  className="absolute right-0 top-0 h-full rounded-l-none rounded-r-lg hover:bg-[#5056FD]/10 hover:text-[#5056FD]"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>
          </div>

          {isLoadingPassword ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading password settings...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex space-x-2">
                  {!hasPassword && (
                    <Switch
                      id="password-protection"
                      checked={passwordProtected}
                      onCheckedChange={setPasswordProtected}
                      className="data-[state=checked]:bg-[#5056FD]"
                    />
                  )}
                  <Label
                    htmlFor="password-protection"
                    className="flex items-center gap-1 text-sm font-medium cursor-pointer"
                  >
                    <Lock className="h-4 w-4" />
                    Password Protection{" "}
                    {hasPassword && (
                      <span className="text-green-500 text-xs">(Active)</span>
                    )}
                  </Label>
                </div>
                {hasPassword && (
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={removePassword}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-transparent hover:underline rounded-lg text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove Protection
                    </Button>
                  </div>
                )}
              </div>

              {passwordProtected && (
                <div className="space-y-4 rounded-xl bg-gradient-to-br from-[#5056FD]/8 to-[#5056FD]/4 border border-[#5056FD]/20 p-5">
                  {hasPassword && (
                    <div className="flex items-center justify-between py-2 rounded-lg border-[#5056FD]/10">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                          <Lock className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Password Active</p>
                          <p className="text-xs text-gray-400">
                            File is protected
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm px-2 py-1 rounded border border-dashed">
                          {showPassword ? savedPassword : "••••••••"}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-300 hover:text-[#5056FD] hover:bg-[#5056FD]/10 text-sm"
                        >
                          {showPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {hasPassword ? "Update Password" : "Set Password"}
                    </Label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder={
                            hasPassword
                              ? "Enter new password"
                              : "Create a secure password"
                          }
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 rounded-lg border-[#5056FD]/30 focus-visible:ring-[#5056FD]/30 focus-visible:border-[#5056FD]/50"
                        />
                      </div>
                      <Button
                        onClick={setFilePassword}
                        disabled={!password}
                        className="rounded-lg bg-[#5056FD] hover:bg-[#4045e0] shadow-md hover:shadow-lg transition-all duration-200 px-6"
                      >
                        {hasPassword ? "Update" : "Enable"}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Anyone with the link will need this password to access the
                      file.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Share via Email
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border-[#5056FD]/20 focus-visible:ring-[#5056FD]/20"
              />
              <Button
                onClick={sendEmail}
                disabled={!email}
                className="rounded-lg bg-[#5056FD] hover:bg-[#4045e0]"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The recipient will receive an email with a link to access this
              file.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
