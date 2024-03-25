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
import StaredTotalCard from "./_components/StaredTotalCard";
import StaredList from "./_components/StaredList";

function Favorites() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [staredList, setstaredList] = useState([]);
  useEffect(() => {
    user && getAllStaredFiles();
  }, [user]);
  const getAllStaredFiles = async () => {
    const q = query(
      collection(db, "uploadedFiles"),
      where("userEmail", "==", user.primaryEmailAddress.emailAddress),
      where("stared", "==", true) // Filter documents where stared is true
    );

    const querySnapshot = await getDocs(q);
    setstaredList([]);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      setstaredList((staredList) => [...staredList, doc.data()]);
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
  };

  return (
    <div className="mx-auto px-10 mt-10">
      <h1 className="text-[1.2rem] font-medium text-primary mb-4">
        Stared Files
      </h1>
      {staredList.length == 0 ? (
        <>
          <div className="mt-20">
            <div className="flex flex-col items-center justify-center">
              <Image src="/no-data.svg" width={120} height={120} />
              <h2 className="mt-6 mb-4 text-[1rem] text-center">
                There are no stared files available.
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
          <StaredTotalCard totalStaredFile={staredList?.length} />
          <StaredList staredList={staredList} updateStared={updateStared} />
        </>
      )}
    </div>
  );
}

export default Favorites;
