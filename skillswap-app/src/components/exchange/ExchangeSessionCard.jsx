import React from "react";
import { motion } from "framer-motion";
import { FiClock, FiCalendar, FiUser, FiMessageSquare } from "react-icons/fi";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import VideoCallButton from "./VideoCallButton";

const ExchangeSessionCard = ({ session, currentUserId }) => {
  const isRequester = currentUserId === session.requesterId;
  const otherUser = isRequester ? session.recipient : session.requester;
  const sessionDate = new Date(`${session.date}T${session.time}`);
  const now = new Date();
  const isPast = sessionDate <= now;

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateDoc(doc(db, "exchanges", session.id), {
        status: newStatus,
        updatedAt: new Date(),
      });
      toast.success(`Request ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update request: " + error.message);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={otherUser.photoURL}
              alt={otherUser.displayName}
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {otherUser.displayName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isRequester ? "You requested to learn" : "Wants to learn"}:{" "}
                {session.skillToLearn}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              session.status === "accepted"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : session.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {session.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5" />
            <p>{new Date(session.date).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiClock className="flex-shrink-0 mr-1.5 h-5 w-5" />
            <p>
              {formatTime(session.time)} ({session.duration} mins)
            </p>
          </div>
        </div>

        {session.message && (
          <div className="mt-4 flex items-start text-sm text-gray-500 dark:text-gray-400">
            <FiMessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 mt-0.5" />
            <p>{session.message}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {session.status === "pending" && !isRequester && (
            <>
              <button
                onClick={() => handleStatusUpdate("accepted")}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Accept
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Decline
              </button>
            </>
          )}

          {session.status === "accepted" && !isPast && (
            <VideoCallButton session={session} />
          )}

          {isPast && (
            <button
              onClick={() => {}}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Leave Feedback
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExchangeSessionCard;
