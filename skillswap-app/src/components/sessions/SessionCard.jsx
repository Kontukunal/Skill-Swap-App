import React from "react";
import { format } from "date-fns";
import { FiMessageSquare, FiClock } from "react-icons/fi";

const SessionCard = ({ session, isActive, onClick }) => {
  // Safely extract lastMessage with defaults
  const lastMessage = session.lastMessage || {};
  const lastMessageText = lastMessage.text || "No messages yet";
  const lastMessageTime = lastMessage.timestamp?.toDate
    ? format(lastMessage.timestamp.toDate(), "h:mm a")
    : "";

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer ${
        isActive
          ? "bg-indigo-50 dark:bg-gray-700"
          : "hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      <div className="flex items-center space-x-3">
        <img
          className="h-10 w-10 rounded-full"
          src={session.otherUser?.photoURL}
          alt={session.otherUser?.displayName}
        />
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
            {session.skillToTeach || "No skill"} for{" "}
            {session.skillToLearn || "No skill"}
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
    </div>
  );
};

export default SessionCard;
