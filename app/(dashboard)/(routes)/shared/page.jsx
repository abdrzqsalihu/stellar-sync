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
} from "firebase/firestore";
import app from "./../../../../firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import Alert from "../../_components/Alert";
import SharedList from "./_components/SharedList";
import SharedTotalCard from "./_components/SharedTotalCard";

function Sharedfilespage() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [sharedList, setsharedList] = useState([]);
  const [alert, setAlert] = useState("");
  useEffect(() => {
    user && getAllStaredFiles();
  }, [user]);
  const getAllStaredFiles = async () => {
    const q = query(
      collection(db, "uploadedFiles"),
      where("userEmail", "==", user.primaryEmailAddress.emailAddress),
      where("shared", "==", true) // Filter documents where stared is true
    );

    const querySnapshot = await getDocs(q);
    setsharedList([]);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      setsharedList((sharedList) => [...sharedList, doc.data()]);
    });
  };

  // Define a function to update the stared property in Firebase
  const updateStared = async (fileId, stared) => {
    const docRef = doc(db, "uploadedFiles", fileId);
    // Assuming `stared` is the correct property name
    await updateDoc(docRef, {
      stared: !stared, // Toggle the value of `stared`
    });
    getAllStaredFiles();
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

  return (
    <div className="mx-auto px-10 mt-10">
      <Alert alert={alert} />
      <h1 className="text-[1.2rem] font-medium text-primary mb-4">
        Shared Files
      </h1>
      {sharedList.length == 0 ? (
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
                There are no shared files available.
              </h2>
              <Link
                href="/files"
                className="p-2 text-white bg-primary rounded-md mt-2 w-[50%] lg:w-[14%] text-center"
              >
                Go to Files
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <SharedTotalCard totalSharedFile={sharedList?.length} />
          <SharedList sharedList={sharedList} updateStared={updateStared} />
        </>
      )}
    </div>
  );
}

export default Sharedfilespage;
