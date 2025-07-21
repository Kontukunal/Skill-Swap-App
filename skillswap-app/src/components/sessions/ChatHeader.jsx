import React, { useState } from "react";
import {
  FiVideo,
  FiClock,
  FiMoreVertical,
  FiTrash2,
  FiCalendar,
} from "react-icons/fi";
import SessionScheduleModal from "./SessionScheduleModal";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const ChatHeader = ({
  session,
  currentUser,
  onScheduleSession,
  onClearChat,
}) => {
  const { theme } = useTheme();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const otherUser =
    session.participants.find((id) => id !== currentUser.uid) ===
    session.requesterId
      ? { name: session.requesterName, photo: session.requesterPhoto }
      : { name: session.recipientName, photo: session.recipientPhoto };

  const handleClearChat = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all messages in this chat?"
      )
    ) {
      onClearChat();
    }
  };

  return (
    <div
      className={`border-b ${theme.mode === "dark" ? "border-gray-700 bg-gray-800/80" : "border-gray-200 bg-white/80"} p-4 flex justify-between items-center backdrop-blur-lg`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
            src={otherUser.photo}
            alt={otherUser.name}
          />
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {otherUser.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="text-indigo-500 dark:text-indigo-400">
              {session.skillToTeach}
            </span>{" "}
            for{" "}
            <span className="text-green-500 dark:text-green-400">
              {session.skillToLearn}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-full ${theme.mode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <FiMoreVertical className="text-gray-600 dark:text-gray-300" />
          </motion.button>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-10 ${theme.mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border backdrop-blur-lg`}
            >
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsScheduleModalOpen(true);
                }}
                className={`flex items-center px-4 py-2 text-sm w-full text-left ${theme.mode === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
              >
                <FiCalendar className="mr-2" /> Schedule Call
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleClearChat();
                }}
                className={`flex items-center px-4 py-2 text-sm w-full text-left ${theme.mode === "dark" ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-100 text-red-600"}`}
              >
                <FiTrash2 className="mr-2" /> Clear Chat
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {isScheduleModalOpen && (
        <SessionScheduleModal
          session={session}
          onClose={() => setIsScheduleModalOpen(false)}
          onSubmit={onScheduleSession}
        />
      )}
    </div>
  );
};

export default ChatHeader;
