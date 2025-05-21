"use client";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useToast } from "../components/ui/use-toast";
import { Copy, Lock, Send } from "lucide-react";
import { useState } from "react";

interface ShareOptionsProps {
  fileId: string;
}

export default function ShareOptions({ fileId }: ShareOptionsProps) {
  const { toast } = useToast();
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [email, setEmail] = useState("");

  const copyLink = () => {
    navigator.clipboard.writeText(
      `https://stellar-sync.vercel.app/preview/${fileId}`
    );
    toast({
      title: "Link copied",
      description: "File link copied to clipboard",
    });
  };

  const sendEmail = () => {
    if (!email) return;

    toast({
      title: "Email sent",
      description: `File has been shared with ${email}`,
    });

    setEmail("");
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

          <div className="flex items-center space-x-2">
            <Switch
              id="password-protection"
              checked={passwordProtected}
              onCheckedChange={setPasswordProtected}
              className="data-[state=checked]:bg-[#5056FD]"
            />
            <Label
              htmlFor="password-protection"
              className="flex items-center gap-1 text-sm font-medium cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              Password Protection
            </Label>
          </div>

          {passwordProtected && (
            <div className="space-y-2 rounded-lg bg-[#5056FD]/5 p-4">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="rounded-lg border-[#5056FD]/20 focus-visible:ring-[#5056FD]/20"
              />
              <p className="text-xs text-muted-foreground">
                Anyone with the link will need this password to access the file.
              </p>
            </div>
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
