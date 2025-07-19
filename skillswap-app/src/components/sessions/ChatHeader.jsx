import React, { useState } from "react";
import { FiVideo, FiClock, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import SessionScheduleModal from "./SessionScheduleModal";

const ChatHeader = ({
  session,
  currentUser,
  onScheduleSession,
  onClearChat,
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const otherUser =
    session.participants.find((id) => id !== currentUser.uid) ===
    session.requesterId
      ? { name: session.requesterName, photo: session.requesterPhoto }
      : { name: session.recipientName, photo: session.recipientPhoto };

  const handleClearChat = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all messages in this chat?"
      )
    ) {
      await onClearChat();
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          className="h-10 w-10 rounded-full"
          src={otherUser.photo}
          alt={otherUser.name}
        />
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {otherUser.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {session.skillToTeach} for {session.skillToLearn}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FiMoreVertical className="text-gray-600 dark:text-gray-300" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsScheduleModalOpen(true);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <FiClock className="mr-2" /> Schedule Call
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleClearChat();
                }}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <FiTrash2 className="mr-2" /> Clear Chat
              </button>
            </div>
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
