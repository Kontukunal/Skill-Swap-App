import React from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCalendar,
  FiUser,
  FiMessageSquare,
  FiVideo,
} from "react-icons/fi";
import VideoCallButton from "./VideoCallButton";
import { useTheme } from "../../contexts/ThemeContext";

const ExchangeSessionCard = ({ session, currentUserId }) => {
  const { theme } = useTheme();
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
    return `${hour > 12 ? hour - 12 : hour}:${minutes.padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass rounded-2xl overflow-hidden shadow-lg border ${theme.mode === "dark" ? "border-gray-700" : "border-gray-200"} backdrop-blur-sm`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
                src={otherUser.photoURL}
                alt={otherUser.displayName}
              />
              <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1">
                <FiUser className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {otherUser.displayName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isRequester ? "You requested to learn" : "Wants to learn"}:{" "}
                <span className="text-indigo-500 dark:text-indigo-400">
                  {session.skillToLearn}
                </span>
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              session.status === "accepted"
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                : session.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300"
            }`}
          >
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            className={`flex items-center p-3 rounded-xl ${theme.mode === "dark" ? "bg-gray-700/30" : "bg-white/50"}`}
          >
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg mr-3">
              <FiCalendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(session.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center p-3 rounded-xl ${theme.mode === "dark" ? "bg-gray-700/30" : "bg-white/50"}`}
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg mr-3">
              <FiClock className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatTime(session.time)} ({session.duration} mins)
              </p>
            </div>
          </div>
        </div>

        {session.message && (
          <div
            className={`mt-4 p-3 rounded-xl ${theme.mode === "dark" ? "bg-gray-700/30" : "bg-white/50"}`}
          >
            <div className="flex items-start">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-lg mr-3">
                <FiMessageSquare className="h-5 w-5 text-pink-500 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Note
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {session.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {session.status === "pending" && !isRequester && (
            <>
              <button
                onClick={() => handleStatusUpdate("accepted")}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm"
              >
                Accept Request
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  theme.mode === "dark"
                    ? "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } shadow-sm`}
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
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm"
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
