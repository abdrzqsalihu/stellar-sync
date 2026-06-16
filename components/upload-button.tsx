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
import { Upload } from "lucide-react";
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

export default function UploadButton({ hasFiles = false }: UploadButtonProps) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const uploadTasksRef = useRef<any[]>([]);
  const isUploadingRef = useRef(false); // Use a ref for sync state
  const storage = getStorage(app);
  const db = getFirestore(app);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

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
    uploadTasksRef.current.forEach(task => {
      task.cancel();
    });
    setUploading(false);
    uploadTasksRef.current = [];
    setProgress(0);
    toast.success("Upload cancelled");
  };

  const uploadFile = async () => {
    // console.log("uploadFile called! selectedFiles:", selectedFiles);
    if (selectedFiles.length === 0 || !user?.primaryEmailAddress?.emailAddress) {
      toast.error("Please select files and ensure you're logged in.");
      return;
    }

    isUploadingRef.current = true; // Update ref immediately
    setUploading(true); // Update state for UI
    setProgress(0);
    uploadTasksRef.current = [];

    try {
      // Check user's current storage usage and limit
      const userRef = doc(db, "users", user.id);
      // console.log("Fetching user record...");
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User record not found");
      }

      const { storageUsed = 0, storageLimit = 1073741824 } = userSnap.data();
      // console.log("User storage used:", storageUsed, "limit:", storageLimit);

      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
      // console.log("Total file size to upload:", totalSize);
      if (storageUsed + totalSize > storageLimit) {
        toast.error("Storage limit exceeded. Upgrade to upload more.");
        isUploadingRef.current = false;
        setUploading(false);
        return;
      }

      let uploadedFilesCount = 0;
      const totalFiles = selectedFiles.length;

      // Upload each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        // console.log("Starting upload for file", i, ":", file.name);
        // If upload was cancelled, stop - check the ref instead of state!
        if (!isUploadingRef.current) {
          // console.log("Upload cancelled, breaking loop");
          break;
        }

      // Sanitize filename for storage to avoid issues with special characters and spaces
        const sanitizedName = file.name.replace(/\s+/g, '_').replace(/[()]/g, '');
        // console.log("Sanitized name:", sanitizedName);
        const storageRef = ref(storage, `uploadedFiles/${sanitizedName}`);

        const metadata = {
          contentType: file.type || 'application/octet-stream',
          customMetadata: {
            uploadedBy: user.primaryEmailAddress.emailAddress,
          },
        };

        await new Promise((resolve, reject) => {
        // console.log("Creating upload task...");
          const uploadTask = uploadBytesResumable(
            storageRef,
            file,
            metadata
          );
          // console.log("Upload task created:", uploadTask);

          // Track the upload task
          uploadTasksRef.current.push(uploadTask);

          // console.log("Attaching event listeners to upload task...");
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // console.log("state_changed event triggered:", snapshot);
              const currentFileProgress = (
                (snapshot.bytesTransferred / snapshot.totalBytes) *
                (100 / totalFiles)
              );
              const totalProgress = (uploadedFilesCount / totalFiles) * 100 + currentFileProgress;
              // console.log("Upload progress:", totalProgress);
              setProgress(Number(totalProgress.toFixed(2)));
            },
            (error) => {
              // console.error("Error during upload:", error);
              if (error.code !== 'storage/cancelled') {
                // toast.error(`Upload failed: ${error.message}`);
              }
              isUploadingRef.current = false;
              setUploading(false);
              uploadTasksRef.current = [];
              reject(error);
            },
            async () => {
              try {
                // console.log("File uploaded! Getting download URL...");
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                // console.log("Download URL:", downloadURL);
                await saveInfo(file, downloadURL, sanitizedName);
                uploadedFilesCount++;
                // console.log("File info saved!");
                resolve(null);
              } catch (error) {
                // console.error("Error getting download URL or saving info:", error);
                isUploadingRef.current = false;
                setUploading(false);
                uploadTasksRef.current = [];
                toast.error("Upload failed");
                reject(error);
              }
            }
          );
        });
      }

      // Only show success if we weren't cancelled - check ref!
      if (isUploadingRef.current) {
        isUploadingRef.current = false;
        setUploading(false);
        setOpen(false);
        setProgress(0);
        setSelectedFiles([]);
        uploadTasksRef.current = [];

        toast.success(`${totalFiles} file${totalFiles !== 1 ? 's' : ''} uploaded successfully`);

        // Refresh the page to show new files!
        router.refresh();
      }
    } catch (error: any) {
      // console.error("Upload failed in try/catch:", error);
      if (error.code !== 'storage/cancelled') {
        toast.error("An error occurred during upload");
    // toast.error("An error occurred during upload: " + error.message);
      }
      isUploadingRef.current = false;
      setUploading(false);
      uploadTasksRef.current = [];
    }
  };

  const saveInfo = async (file: File, fileUrl: string, storageName?: string) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      throw new Error("User email not available");
    }

    const docId = GenerateRandomString(10);

    await setDoc(doc(db, "uploadedFiles", docId), {
      fileName: storageName || file.name,
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

    // Note: We don't navigate here for multiple files - handled in uploadFile
  };

  const handleUpload = () => {
    // console.log("handleUpload clicked!");
    uploadFile();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Upload a file to your cloud storage.
          </DialogDescription>
        </DialogHeader>

        {uploading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Uploading {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
              </span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-3 [&>div]:bg-[#5056FD] rounded-lg"
            />
            <p className="text-xs text-muted-foreground">
              Please don't close this window while uploading...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-4">
              {selectedFiles.length === 0 && (
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
                    multiple
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileChange}
                />
              </div>
            )}

              {selectedFiles.length > 0 && (
                <div className="w-full rounded-xl border p-4 shadow-sm z-40 space-y-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between">
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" title={file.name}>{truncateFileName(file.name)}</p>
                      <p className="text-xs text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
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
                  ))}
              </div>
            )}
            </div>
        )}

        <DialogFooter className="sm:justify-end z-40">
          <Button
            variant="outline"
            onClick={uploading ? cancelUpload : () => setOpen(false)}
            disabled={!uploading && selectedFiles.length === 0}
            className="rounded-lg border-[#5056FD]/20 hover:bg-[#5056FD]/5 hover:text-[#5056FD]"
          >
            {uploading ? "Cancel Upload" : "Cancel"}
          </Button>
          <Button
            className="rounded-lg bg-[#5056FD] hover:bg-[#4045e0]"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
