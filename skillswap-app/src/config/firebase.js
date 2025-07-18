import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvJ8j0JWXLKmRgqgcZrn0Eqw6WYEaiOnQ",
  authDomain: "skillswap-app-b3980.firebaseapp.com",
  projectId: "skillswap-app-b3980",
  storageBucket: "skillswap-app-b3980.firebasestorage.app",
  messagingSenderId: "789733376891",
  appId: "1:789733376891:web:1acc648f1ea44a4099f3de",
  measurementId: "G-GXGZYGWBZR",
};

const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence with error handling
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a time.
    console.log("Persistence failed: Multiple tabs open");
  } else if (err.code === "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    console.log("Persistence failed: Browser not supported");
  }
  console.log("Firestore persistence error: ", err);
});
