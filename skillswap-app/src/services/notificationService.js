import { db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const sendNotification = async ({ 
  userId, 
  title, 
  message, 
  type, 
  relatedId,
  meetingLink 
}) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      relatedId,
      meetingLink,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};