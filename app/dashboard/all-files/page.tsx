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
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AllFilesPage() {
  const db = getFirestore(app);
  const { user } = useUser();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [fileList, setFileList] = useState([]);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    user && getAllUserFiles();
  }, [user, category]);

  // Helper function to get file types based on category
  const getFileTypesByCategory = (category: string | null) => {
    switch (category) {
      case "document":
        return [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
        ];
      case "image":
        return [
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/gif",
          "image/svg",
          "image/webp",
          "image/bmp",
        ];
      case "video":
        return [
          "video/mp4",
          "video/quicktime",
          "video/x-msvideo",
          "video/x-flv",
          "video/mp2t",
          "video/3gpp",
          "video/3gpp2",
          "video/x-m4v",
          "video/webm",
          "video/x-mng",
          "video/ogg",
          "video/ogv",
          "video/dash",
          "video/x-ms-wmv",
          "video/x-ms-asf",
        ];
      case "audio":
        return [
          "audio/mpeg",
          "audio/ogg",
          "audio/wav",
          "audio/webm",
          "audio/aac",
          "audio/flac",
          "audio/mp4",
        ];
      case "design":
        return [
          // Figma file types
          "application/figma",
          "application/vnd.figma",
          // Adobe file types
          "application/x-photoshop",
          "application/photoshop",
          "application/psd",
          "application/vnd.adobe.photoshop",
          "application/illustrator",
          "application/vnd.adobe.illustrator",
          "application/pdf+ai",
          "application/x-indesign",
          "application/vnd.adobe.indesign-idml-package",
          "application/x-adobe-xd",
          "application/vnd.adobe.xd",
          "application/x-adobe-premiere",
          "application/vnd.adobe.premiere-proj",
          "application/x-adobe-aftereffects",
          "application/vnd.adobe.aftereffects.proj",
        ];

      default:
        return null;
    }
  };

  useEffect(() => {
    user && getAllUserFiles();
  }, [user]);
  const getAllUserFiles = async () => {
    let q = query(
      collection(db, "uploadedFiles"),
      where("userEmail", "==", user.primaryEmailAddress.emailAddress)
    );

    if (category) {
      const fileTypes = getFileTypesByCategory(category);

      if (fileTypes) {
        // Fetch documents for each file type and merge the results
        const querySnapshots = await Promise.all(
          fileTypes.map(async (fileType) => {
            const typeQuery = query(
              collection(db, "uploadedFiles"),
              where("userEmail", "==", user.primaryEmailAddress.emailAddress),
              where("fileType", "==", fileType)
            );
            return getDocs(typeQuery);
          })
        );

        setFileList([]);
        querySnapshots.forEach((snapshot) => {
          snapshot.forEach((doc) => {
            setFileList((fileList) => [...fileList, doc.data()]);
          });
        });
        return;
      }
    }

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

  const getPageTitle = () => {
    if (category === "document") return "Documents";
    if (category === "image") return "Images";
    if (category === "audio") return "Audios";
    if (category === "video") return "Videos";
    if (category === "design") return "Designs";
    return "All Files";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-muted-foreground">
            {category
              ? `View and manage your ${getPageTitle().toLowerCase()}.`
              : "View and manage all your files in one place."}
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
