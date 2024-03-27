"use client";
import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../../../../../firebaseConfig";
import FileInfo from "../_components/FileInfo";
import ShareFileForm from "../_components/ShareFileForm";
import Breadcrumb from "../_components/Breadcrumb";

function page({ params }) {
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const [file, setFile] = useState();

  useEffect(() => {
    // console.log(params?.fileId);
    params?.fileId && getFileInfo();
  }, []);

  const getFileInfo = async () => {
    const docRef = doc(db, "uploadedFiles", params?.fileId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setFile(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const onPasswordSave = async (password) => {
    const docRef = doc(db, "uploadedFiles", params?.fileId);
    await updateDoc(docRef, {
      password: password,
    });
  };

  const updateShared = async () => {
    const docRef = doc(db, "uploadedFiles", params?.fileId);
    // Assuming `shared` is the correct property name
    await updateDoc(docRef, {
      shared: true, // Toggle the value of `shared`
    });
  };

  return (
    <div className="mx-auto px-10 mt-10">
      <div className="max-w-[90%] lg:max-w-[38%] mx-auto">
        <Breadcrumb />
        <FileInfo file={file} />
        <ShareFileForm
          file={file}
          onPasswordSave={(password) => onPasswordSave(password)}
          updateShared={updateShared}
        />
      </div>
    </div>
  );
}

export default page;
