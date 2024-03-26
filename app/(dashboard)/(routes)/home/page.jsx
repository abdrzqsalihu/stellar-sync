"use client";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../../../../firebaseConfig";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Overview from "./_components/Overview";
import UploadFile from "./_components/UploadFile";
import { useRouter } from "next/navigation";
import { GenerateRandomString } from "../../../constants/GenerateRandomString";

function HomePage() {
  const router = useRouter();
  const { user } = useUser();
  const [fileDocId, setFileDocId] = useState();
  const [progress, setProgress] = useState();
  const [allFilesCount, setAllFilesCount] = useState(0);
  const [staredFilesCount, setStaredFilesCount] = useState(0);
  const storage = getStorage(app);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  useEffect(() => {
    user && getAllFilesCount();
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
  };

  const uploadFile = (file) => {
    // const metadata = {
    //   contentType: file.type,
    // };
    const storageRef = ref(storage, "uploadedFiles/" + file?.name);
    const uploadTask = uploadBytesResumable(storageRef, file, file.type);
    uploadTask.on("state_changed", (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");

      // Upload completed successfully, now we can get the download URL
      setProgress(progress);
      progress == 100 &&
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          saveInfo(file, downloadURL);
        });
    });
  };

  const saveInfo = async (file, fileUrl) => {
    const docId = GenerateRandomString().toString();
    await setDoc(doc(db, "uploadedFiles", docId), {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      fileUrl: fileUrl,
      userEmail: user?.primaryEmailAddress.emailAddress,
      userName: user?.fullName,
      password: "",
      stared: false,
      shared: false,
      id: docId,
      shortUrl: process.env.NEXT_PUBLIC_BASE_URL + docId,
    });
    setFileDocId(docId);
    router.push("/file-preview/" + docId); // Push to router after saving info
    // setUploadCompleted(true); // Trigger upload completion after saving info
    // return docId; // Return the generated docId
  };

  return (
    <div className="mx-auto px-10 mt-10">
      <Overview
        allFilesCount={allFilesCount}
        staredFilesCount={staredFilesCount}
      />
      <h1 className="text-[1.3rem] font-medium text-primary opacity-90 mt-12 text-center">
        Upload your file here
      </h1>
      <UploadFile
        uploadBtnClick={(file) => uploadFile(file)}
        progress={progress}
      />
    </div>
  );
}

export default HomePage;
