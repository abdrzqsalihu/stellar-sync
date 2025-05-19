"use client";

import type React from "react";

import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { useToast } from "../components/ui/use-toast";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setOpen(false);

          toast({
            title: "File uploaded successfully",
            description: `${selectedFile.name} has been uploaded to your storage.`,
          });

          // Simulate redirect to file view page
          setTimeout(() => {
            router.push(`/dashboard/file/1`);
          }, 500);

          return 0;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5056FD] hover:bg-[#4045e0]">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>
          <DialogDescription>
            Upload a file to your cloud storage.
          </DialogDescription>
        </DialogHeader>

        {uploading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Uploading {selectedFile?.name}
              </span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-3 rounded-lg"
              indicatorClassName="bg-[#5056FD] rounded-lg"
            />
            <p className="text-xs text-muted-foreground">
              Please don't close this window while uploading...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="group flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#5056FD]/20 bg-[#5056FD]/5 p-4 text-center transition-all hover:border-[#5056FD]/40 hover:bg-[#5056FD]/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5056FD]/10 transition-transform group-hover:scale-110">
                <Upload className="h-8 w-8 text-[#5056FD]" />
              </div>
              <p className="mt-4 text-sm font-medium">
                Drag and drop your file here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse files
              </p>
              <input
                type="file"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
            </div>

            {selectedFile && (
              <div className="w-full rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#5056FD]/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-[#5056FD]"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setSelectedFile(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={uploading}
            className="rounded-lg border-[#5056FD]/20 hover:bg-[#5056FD]/5 hover:text-[#5056FD]"
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg bg-[#5056FD] hover:bg-[#4045e0]"
            onClick={simulateUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
