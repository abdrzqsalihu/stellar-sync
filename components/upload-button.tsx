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
import { CheckCircle2, Upload, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { app } from "../firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

// helper function to generating random strings
function GenerateRandomString(length: number = 10): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// helper function to truncate file names in the middle
function truncateFileName(fileName: string, maxLength: number = 30): string {
  if (fileName.length <= maxLength) return fileName;

  const extension = fileName.lastIndexOf('.') > 0 ? fileName.slice(fileName.lastIndexOf('.')) : '';
  const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.') > 0 ? fileName.lastIndexOf('.') : undefined);

  const availableLength = maxLength - extension.length - 3; // 3 for '...'
  const start = Math.ceil(availableLength / 2);
  const end = nameWithoutExtension.length - Math.floor(availableLength / 2);

  return `${nameWithoutExtension.slice(0, start)}...${nameWithoutExtension.slice(end)}${extension}`;
}

interface UploadButtonProps {
  hasFiles?: boolean;
}

type FileStatus = "pending" | "uploading" | "success" | "error";

interface QueuedFile {
  id: string; // also the Firestore doc id and storage key, so retries overwrite instead of duplicating
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
}

export default function UploadButton({ hasFiles = false }: UploadButtonProps) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const uploadTasksRef = useRef<any[]>([]);
  const isUploadingRef = useRef(false); // Use a ref for sync state
  const runIdRef = useRef(0); // Invalidates a cancelled run so it can't keep uploading
  const storage = getStorage(app);
  const db = getFirestore(app);

  const updateItem = (id: string, patch: Partial<QueuedFile>) => {
    setQueue(prev => prev.map(q => (q.id === id ? { ...q, ...patch } : q)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    e.target.value = ""; // allow re-selecting the same file later

    setQueue(prev => {
      const isSame = (a: File, b: File) =>
        a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
      const fresh = newFiles.filter(f => !prev.some(q => isSame(q.file, f)));
      return [
        ...prev,
        ...fresh.map(file => ({
          id: GenerateRandomString(10),
          file,
          status: "pending" as FileStatus,
          progress: 0,
        })),
      ];
    });
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && !isUploadingRef.current) setQueue([]);
  };

  const uploadableCount = queue.filter(
    q => q.status === "pending" || q.status === "error"
  ).length;
  const hasFailed = queue.some(q => q.status === "error");
  const overallProgress = queue.length
    ? Number(
        (
          queue.reduce(
            (acc, q) => acc + (q.status === "success" ? 100 : q.progress),
            0
          ) / queue.length
        ).toFixed(0)
      )
    : 0;
  const doneCount = queue.filter(
    q => q.status === "success" || q.status === "error"
  ).length;

  useEffect(() => {
    const signInWithClerk = async () => {
      try {
        const auth = getAuth(app);
        const token = await getToken({ template: "integration_firebase" });
        const userCredentials = await signInWithCustomToken(auth, token || "");
        // console.log(userCredentials.user);
      } catch (error) {
        console.error("Error signing in with Clerk and Firebase:", error);
      }
    };

    user && signInWithClerk();
  }, [user, getToken]);

  const cancelUpload = () => {
    isUploadingRef.current = false; // Update ref immediately
    runIdRef.current++; // stop the in-flight run from starting more files
    uploadTasksRef.current.forEach(task => {
      task.cancel();
    });
    uploadTasksRef.current = [];
    setUploading(false);
    setQueue(prev =>
      prev.map(q =>
        q.status === "uploading" ? { ...q, status: "pending", progress: 0 } : q
      )
    );
    toast.success("Upload cancelled");
  };

  const uploadOne = (item: QueuedFile, email: string) =>
    new Promise<void>((resolve, reject) => {
      // Storage key is the unique doc id; the original filename lives only in Firestore
      const storageRef = ref(storage, `uploadedFiles/${item.id}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file, {
        contentType: item.file.type || "application/octet-stream",
        customMetadata: { uploadedBy: email },
      });
      uploadTasksRef.current.push(uploadTask);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = snapshot.totalBytes
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            : 100;
          updateItem(item.id, { progress: pct });
        },
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await saveInfo(item.file, downloadURL, item.id);
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      );
    });

  const uploadFile = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    const toUpload = queue.filter(
      q => q.status === "pending" || q.status === "error"
    );
    if (toUpload.length === 0 || !user || !email) {
      toast.error("Please select files and ensure you're logged in.");
      return;
    }
    if (isUploadingRef.current) return; // guard against double submit

    isUploadingRef.current = true; // Update ref immediately
    const runId = ++runIdRef.current;
    setUploading(true); // Update state for UI
    uploadTasksRef.current = [];
    setQueue(prev =>
      prev.map(q =>
        q.status === "error"
          ? { ...q, status: "pending", progress: 0, error: undefined }
          : q
      )
    );

    let succeeded = 0;
    let failed = 0;
    let cancelled = false;

    try {
      // Check user's current storage usage and limit
      const userSnap = await getDoc(doc(db, "users", user.id));
      if (!userSnap.exists()) {
        throw new Error("User record not found");
      }
      const { storageUsed = 0, storageLimit = 1073741824 } = userSnap.data();
      let used = storageUsed;

      // Upload each file; one failure must not stop the others
      for (const item of toUpload) {
        if (runIdRef.current !== runId) {
          cancelled = true;
          break;
        }

        if (used + item.file.size > storageLimit) {
          updateItem(item.id, { status: "error", error: "Storage limit exceeded" });
          failed++;
          continue;
        }

        updateItem(item.id, { status: "uploading", progress: 0, error: undefined });
        try {
          await uploadOne(item, email);
          used += item.file.size;
          succeeded++;
          updateItem(item.id, { status: "success", progress: 100 });
        } catch (error: any) {
          if (runIdRef.current !== runId) {
            cancelled = true;
            break;
          }
          failed++;
          updateItem(item.id, { status: "error", progress: 0, error: "Upload failed" });
        }
      }

      // Refresh the page to show new files!
      if (succeeded > 0) router.refresh();
      if (cancelled) return;

      if (failed === 0) {
        setOpen(false);
        setQueue([]);
        toast.success(`${succeeded} file${succeeded !== 1 ? "s" : ""} uploaded successfully`);
      } else {
        toast.error(
          succeeded > 0
            ? `${succeeded} uploaded, ${failed} failed`
            : `${failed} file${failed !== 1 ? "s" : ""} failed to upload`
        );
      }
    } catch (error: any) {
      toast.error("An error occurred during upload");
      setQueue(prev =>
        prev.map(q => (q.status === "uploading" ? { ...q, status: "pending", progress: 0 } : q))
      );
    } finally {
      // A cancelled run has already reset state; don't clobber a newer run
      if (runIdRef.current === runId) {
        isUploadingRef.current = false;
        setUploading(false);
        uploadTasksRef.current = [];
      }
    }
  };

  const saveInfo = async (file: File, fileUrl: string, docId: string) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      throw new Error("User email not available");
    }

    await setDoc(doc(db, "uploadedFiles", docId), {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: fileUrl,
      userEmail: user.primaryEmailAddress.emailAddress,
      userName: user.fullName || "",
      password: "",
      starred: false,
      shared: false,
      id: docId,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${docId}`,
      uploadedAt: new Date().toISOString(),
    });

    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, {
      storageUsed: increment(file.size),
    });
  };

  const handleUpload = () => {
    uploadFile();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={`bg-[#5056FD] hover:bg-[#4045e0] ${
            !hasFiles ? "px-10" : ""
          }`}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="z-40">
          <DialogTitle>Upload file</DialogTitle>
          <DialogDescription>
            Upload one or more files to your cloud storage.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4 py-4">
          {queue.length === 0 && (
            <div className="group flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#5056FD]/20 bg-[#5056FD]/5 p-4 text-center transition-all hover:border-[#5056FD]/40 hover:bg-[#5056FD]/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5056FD]/10 transition-transform group-hover:scale-110">
                <Upload className="h-8 w-8 text-[#5056FD]" />
              </div>
              <p className="mt-4 text-sm font-medium">
                Drag and drop your files here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse files
              </p>
              <input
                type="file"
                multiple
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
            </div>
          )}

          {queue.length > 0 && (
            <div className="w-full space-y-3">
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Uploading {doneCount} of {queue.length} file{queue.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-medium">{overallProgress}%</span>
                  </div>
                  <Progress
                    value={overallProgress}
                    className="h-3 [&>div]:bg-[#5056FD] rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Please don't close this window while uploading...
                  </p>
                </div>
              )}

              <div className="max-h-64 w-full space-y-3 overflow-y-auto rounded-xl border p-4 shadow-sm z-40">
                {queue.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#5056FD]/10">
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
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium" title={item.file.name}>
                            {truncateFileName(item.file.name)}
                          </p>
                          <p
                            className={`text-xs ${
                              item.status === "error"
                                ? "text-red-500"
                                : item.status === "success"
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.status === "error"
                              ? item.error
                              : item.status === "success"
                              ? "Uploaded"
                              : item.status === "uploading"
                              ? `Uploading ${item.progress}%`
                              : `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`}
                          </p>
                        </div>
                      </div>
                      {item.status === "success" && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                      )}
                      {item.status === "error" && !uploading && (
                        <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                      )}
                      {(item.status === "pending" ||
                        (item.status === "error" && !uploading)) &&
                        !uploading && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 shrink-0 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() =>
                              setQueue(prev => prev.filter(q => q.id !== item.id))
                            }
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
                        )}
                    </div>
                    {item.status === "uploading" && (
                      <Progress
                        value={item.progress}
                        className="h-1.5 [&>div]:bg-[#5056FD] rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>

              {!uploading && (
                <label className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-[#5056FD]/30 py-2 text-sm font-medium text-[#5056FD] hover:bg-[#5056FD]/5">
                  <Upload className="mr-2 h-4 w-4" />
                  Add more files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end z-40">
          <Button
            variant="outline"
            onClick={uploading ? cancelUpload : () => handleOpenChange(false)}
            disabled={!uploading && queue.length === 0}
            className="rounded-lg border-[#5056FD]/20 hover:bg-[#5056FD]/5 hover:text-[#5056FD]"
          >
            {uploading ? "Cancel Upload" : hasFailed || queue.some(q => q.status === "success") ? "Close" : "Cancel"}
          </Button>
          <Button
            className="rounded-lg bg-[#5056FD] hover:bg-[#4045e0]"
            onClick={handleUpload}
            disabled={uploadableCount === 0 || uploading}
          >
            {uploading ? "Uploading..." : hasFailed ? "Retry failed" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
