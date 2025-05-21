"use client";

import DashboardLayout from "../../../components/dashboard-layout";
import FileGrid from "../../../components/file-grid";
import UploadButton from "../../../components/upload-button";
import { Button } from "../../../components/ui/button";
import { FolderPlus } from "lucide-react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function AllFilesPage() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [fileList, setFileList] = useState([]);
  const [alert, setAlert] = useState("");
  useEffect(() => {
    user && getAllUserFiles();
  }, [user]);
  const getAllUserFiles = async () => {
    const q = query(
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

    // Determine the status and message based on the action taken
    const status = stared ? "File unstarred" : "File starred";
    const msg = stared
      ? "file unstarred successfully!"
      : "file starred successfully!";

    // setAlert({
    //   status: status,
    //   msg: msg,
    // });
  };

  //function to delete data from Firestore
  const deleteFile = async (fileId) => {
    try {
      const docRef = doc(db, "uploadedFiles", fileId);
      await deleteDoc(docRef);
      getAllUserFiles();

      // setAlert({
      //   status: "File deleted",
      //   msg: "File deleted successfully!",
      // });
    } catch (error) {
      console.error("Error deleting file:", error);
      // setAlert({
      //   status: "Error",
      //   msg: "An error occurred while deleting the file.",
      // });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">All Files</h1>
          <p className="text-muted-foreground">
            View and manage all your files in one place.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <FileGrid
          fileList={fileList}
          updateStared={updateStared}
          deleteFile={deleteFile}
        />
      </div>
    </DashboardLayout>
  );
}
