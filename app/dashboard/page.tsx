"use client";

import DashboardLayout from "../../components/dashboard-layout";
import FileStats from "../../components/file-stats";
import RecentFiles from "../../components/recent-files";
import StorageStats from "../../components/storage-stats";
import UploadButton from "../../components/upload-button";
import { Button } from "../../components/ui/button";
import { FolderPlus } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import toast from "react-hot-toast";
import { deleteObject, getStorage, ref } from "firebase/storage";

export default function DashboardPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [allFilesCount, setAllFilesCount] = useState(0);
  const [staredFilesCount, setStaredFilesCount] = useState(0);
  const [sharedFilesCount, setSharedFilesCount] = useState(0);
  const [fileList, setFileList] = useState([]);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    user && getAllFilesCount();
  }, [user]);

  useEffect(() => {
    const signInWithClerk = async () => {
      try {
        const auth = getAuth(app);
        const token = await getToken({ template: "integration_firebase" });
        const userCredentials = await signInWithCustomToken(auth, token);
        // console.log(userCredentials.user);
      } catch (error) {
        console.error("Error signing in with Clerk and Firebase:", error);
      }
    };

    user && signInWithClerk();
  }, [user, getToken]);

  useEffect(() => {
    user && getAllUserFiles();
  }, [user]);

  const getAllFilesCount = async () => {
    const q = query(
      collection(db, "uploadedFiles"),
      where("userEmail", "==", user.primaryEmailAddress.emailAddress)
    );

    const querySnapshot = await getDocs(q);
    setAllFilesCount(querySnapshot.size);

    // Calculate the number of stared files
    let staredCount = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.stared) {
        staredCount++;
      }
    });
    setStaredFilesCount(staredCount);

    // Calculate the number of stared files
    let sharedCount = 0;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.shared) {
        sharedCount++;
      }
    });
    setSharedFilesCount(sharedCount);
  };

  useEffect(() => {
    user && getAllUserFiles();
  }, [user]);
  const getAllUserFiles = async () => {
    let q = query(
      collection(db, "uploadedFiles"),
      where("userEmail", "==", user.primaryEmailAddress.emailAddress)
    );

    const querySnapshot = await getDocs(q);
    setFileList([]);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      setFileList((fileList) => [...fileList, doc.data()]);
    });
  };

  // function to update the stared property in Firebase
  const updateStared = async (fileId, stared) => {
    const docRef = doc(db, "uploadedFiles", fileId);
    // Assuming `stared` is the correct property name
    await updateDoc(docRef, {
      stared: !stared, // Toggle the value of `stared`
    });
    getAllUserFiles();

    // Determine the status based on the action taken
    const msg = stared
      ? "file unstarred successfully!"
      : "file starred successfully!";

    toast.success(msg);
  };

  //function to delete data from Firestore
  const deleteFile = async (fileId: string) => {
    try {
      // Get file document
      const docRef = doc(db, "uploadedFiles", fileId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("File not found!");
        return;
      }

      const fileData = docSnap.data();
      let storageDeleted = false;

      // Try to delete from storage
      if (fileData.fileUrl) {
        try {
          // Extract path from URL
          const url = new URL(fileData.fileUrl);
          const pathMatch = url.pathname.match(/\/o\/(.+?)(?:\?|$)/);

          if (pathMatch) {
            const decodedPath = decodeURIComponent(pathMatch[1]);
            const storageRef = ref(storage, decodedPath);
            await deleteObject(storageRef);
            storageDeleted = true;
          }
        } catch (error) {
          // If URL method fails, try fileName method
          if (fileData.fileName) {
            try {
              const storageRef = ref(
                storage,
                `uploadedFiles/${fileData.fileName}`
              );
              await deleteObject(storageRef);
              storageDeleted = true;
            } catch (err) {
              console.log("Storage deletion failed:", err.code);
              storageDeleted = err.code === "storage/object-not-found";
            }
          }
        }
      }

      // Delete from Firestore
      await deleteDoc(docRef);
      getAllUserFiles();

      // Show success message
      toast.success(
        storageDeleted
          ? "File deleted successfully!"
          : "File record deleted successfully"
      );
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Failed to delete file: ${error.message || "Unknown error"}`);
    }
  };
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your file storage dashboard.
          </p>
        </div>

        {/* File Stats Section */}
        <FileStats
          allFilesCount={allFilesCount}
          staredFilesCount={staredFilesCount}
          sharedFilesCount={sharedFilesCount}
        />

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold">Recent Files</h2>
              <div className="flex gap-2">
                <UploadButton />
                <Button
                  variant="outline"
                  size="sm"
                  className="group h-10 gap-2 rounded-md border-dashed hover:border-primary hover:bg-primary/5"
                >
                  <FolderPlus className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
                  <span className="group-hover:text-primary">New Folder</span>
                </Button>
              </div>
            </div>

            <RecentFiles
              fileList={fileList}
              updateStared={updateStared}
              deleteFile={deleteFile}
            />
          </div>

          <div className="w-full md:w-80 space-y-6">
            <StorageStats />

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="bg-primary/5 p-6">
                <div className="flex flex-col space-y-1.5">
                  <h3 className="font-semibold leading-none tracking-tight">
                    Upgrade to Pro
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get more storage and premium features
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
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
                          className="h-3 w-3 text-primary"
                        >
                          <path d="M2 20h20V8H2z" />
                          <path d="M12 4v4" />
                          <path d="M10 4h4" />
                        </svg>
                      </div>
                      <span>100GB Storage</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
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
                          className="h-3 w-3 text-primary"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </div>
                      <span>Advanced sharing options</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
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
                          className="h-3 w-3 text-primary"
                        >
                          <rect
                            width="18"
                            height="11"
                            x="3"
                            y="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <span>No expiry on shared files</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
