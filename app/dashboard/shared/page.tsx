"use client";
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
import DashboardLayout from "../../../components/dashboard-layout";
import FileGrid from "../../../components/file-grid";
import { app } from "../../../firebaseConfig";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SharedPage() {
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

    toast.success(msg);

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
          <h1 className="text-2xl font-bold tracking-tight">Shared Files</h1>
          <p className="text-muted-foreground">
            Manage files you've shared with others.
          </p>
        </div>

        <FileGrid
          shared={true}
          fileList={fileList}
          updateStared={updateStared}
          deleteFile={deleteFile}
        />
      </div>
    </DashboardLayout>
  );
}
