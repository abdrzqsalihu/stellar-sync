// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "stellar-sync-9bb8a.firebaseapp.com",
  projectId: "stellar-sync-9bb8a",
  storageBucket: "stellar-sync-9bb8a.appspot.com",
  messagingSenderId: "808490194760",
  appId: "1:808490194760:web:0804f21bd2661275c3857d",
  measurementId: "G-2S41TNT8VY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
