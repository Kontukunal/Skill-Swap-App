import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvJ8j0JWXLKmRgqgcZrn0Eqw6WYEaiOnQ",
  authDomain: "skillswap-app-b3980.firebaseapp.com",
  projectId: "skillswap-app-b3980",
  storageBucket: "skillswap-app-b3980.appspot.com",
  messagingSenderId: "789733376891",
  appId: "1:789733376891:web:1acc648f1ea44a4099f3de",
  measurementId: "G-GXGZYGWBZR",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
});

const checkPersistence = async () => {
  try {
    await db;
    console.log("Firestore persistence is ready");
  } catch (err) {
    console.error("Firestore initialization error:", err);
  }
};

checkPersistence();
