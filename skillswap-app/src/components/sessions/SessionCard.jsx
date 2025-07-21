import React from "react";
import { format } from "date-fns";
import { FiMessageSquare, FiClock, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const SessionCard = ({ session, isActive, onClick }) => {
  const { theme } = useTheme();
  const lastMessage = session.lastMessage || {};
  const lastMessageText = lastMessage.text || "No messages yet";
  const lastMessageTime = lastMessage.timestamp?.toDate
    ? format(lastMessage.timestamp.toDate(), "h:mm a")
    : "";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors ${isActive ? (theme.mode === "dark" ? "bg-gray-700/50" : "bg-indigo-50") : theme.mode === "dark" ? "hover:bg-gray-700/30" : "hover:bg-gray-50"}`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
            src={session.otherUser?.photoURL}
            alt={session.otherUser?.displayName}
          />
          {session.status === "accepted" && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
              <FiCheckCircle className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {session.otherUser?.displayName || "Unknown User"}
            </h3>
            {lastMessageTime && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lastMessageTime}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            <span className="text-indigo-500 dark:text-indigo-400">
              {session.skillToTeach || "No skill"}
            </span>{" "}
            for{" "}
            <span className="text-green-500 dark:text-green-400">
              {session.skillToLearn || "No skill"}
            </span>
          </p>
          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
            <FiMessageSquare className="mr-1" />
            <span className="truncate">{lastMessageText}</span>
          </div>
          {session.date && session.time && (
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <FiClock className="mr-1" />
              <span>
                {format(
                  new Date(`${session.date}T${session.time}`),
                  "MMM d, h:mm a"
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;
