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
import { useUser, useAuth } from "@clerk/nextjs";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import Overview from "./_components/Overview";
import UploadFile from "./_components/UploadFile";
import { useRouter } from "next/navigation";
import { GenerateRandomString } from "../../../constants/GenerateRandomString";

function HomePage() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [fileDocId, setFileDocId] = useState();
  const [progress, setProgress] = useState();
  const [allFilesCount, setAllFilesCount] = useState(0);
  const [staredFilesCount, setStaredFilesCount] = useState(0);
  const [sharedFilesCount, setSharedFilesCount] = useState(0);
  const storage = getStorage(app);
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

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

  const uploadFile = async (file) => {
    try {
      const storageRef = ref(storage, `uploadedFiles/${file.name}`);
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedBy: user.primaryEmailAddress.emailAddress,
        },
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Error during upload:", error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            saveInfo(file, downloadURL);
          });
        }
      );
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
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
        sharedFilesCount={sharedFilesCount}
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
