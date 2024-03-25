"use client";
import React, { useEffect, useState } from "react";
import { app } from "../../../firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import FileItem from "./_components/FileItem";
import Link from "next/link";
import Image from "next/image";
function FileView({ params }) {
  const db = getFirestore(app);
  const [file, setFile] = useState();
  useEffect(() => {
    // console.log(params.fileId)
    params.fileId && getFileInfo();
  }, []);

  const getFileInfo = async () => {
    const docRef = doc(db, "uploadedFiles", params?.fileId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setFile(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  return (
    <div
      className="
    bg-gray-100 h-screen w-full flex justify-center
    items-center flex-col gap-4"
    >
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
          className="mb-4"
        />
      </Link>
      <FileItem file={file} />
    </div>
  );
}

export default FileView;
