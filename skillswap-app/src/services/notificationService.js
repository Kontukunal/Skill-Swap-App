import { db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const sendNotification = async ({
  userId,
  title,
  message,
  type,
  relatedId,
  meetingLink,
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
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

export const sendExchangeRequestNotification = async (
  recipientId,
  senderName,
  skillToTeach,
  skillToLearn,
  exchangeId,
  meetingLink
) => {
  return sendNotification({
    userId: recipientId,
    title: "New Exchange Request",
    message: `${senderName} wants to exchange ${skillToTeach} for ${skillToLearn}`,
    type: "exchange_request",
    relatedId: exchangeId,
    meetingLink,
  });
};

export const sendExchangeConfirmationNotification = async (
  recipientId,
  senderName,
  exchangeId,
  meetingLink
) => {
  return sendNotification({
    userId: recipientId,
    title: "Exchange Request Accepted",
    message: `${senderName} accepted your exchange request`,
    type: "exchange_confirmation",
    relatedId: exchangeId,
    meetingLink,
  });
};

export const sendSessionScheduledNotification = async (
  recipientId,
  senderName,
  date,
  time,
  duration,
  exchangeId,
  meetingLink
) => {
  return sendNotification({
    userId: recipientId,
    title: "Session Scheduled",
    message: `${senderName} scheduled a session for ${date} at ${time} (${duration} minutes)`,
    type: "session_scheduled",
    relatedId: exchangeId,
    meetingLink,
  });
};
