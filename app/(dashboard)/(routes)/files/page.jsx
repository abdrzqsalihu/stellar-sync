"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "./../../../../firebaseConfig";
import FileTotalCard from "./_components/FileTotalCard";
import FileList from "./_components/FileList";
import Link from "next/link";
import Image from "next/image";
import Alert from "../../_components/Alert";

function Files() {
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

  // Define a function to update the stared property in Firebase
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

    setAlert({
      status: status,
      msg: msg,
    });
  };

  //function to delete data from Firestore
  const deleteFile = async (fileId) => {
    try {
      const docRef = doc(db, "uploadedFiles", fileId);
      await deleteDoc(docRef);
      getAllUserFiles();

      setAlert({
        status: "File deleted",
        msg: "File deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      setAlert({
        status: "Error",
        msg: "An error occurred while deleting the file.",
      });
    }
  };

  return (
    <div className="mx-auto px-10 mt-10">
      <Alert alert={alert} />
      <h1 className="text-[1.2rem] font-medium text-primary mb-4">My Files</h1>
      {fileList.length == 0 ? (
        <>
          <div className="mt-20">
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/no-data.svg"
                width={120}
                height={120}
                alt="No data"
              />
              <h2 className="mt-6 mb-4 text-[1rem] text-center">
                There are no files available.
              </h2>
              <Link
                href="/home"
                className="p-2 text-white bg-primary rounded-md mt-2 w-[50%] lg:w-[14%] text-center"
              >
                Upload Now
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <FileTotalCard totalFile={fileList?.length} />
          <FileList
            fileList={fileList}
            updateStared={updateStared}
            deleteFile={deleteFile}
          />
        </>
      )}
    </div>
  );
}

export default Files;
