import React, { useState } from "react";
import { FiVideo, FiClock, FiMoreVertical, FiX } from "react-icons/fi";
import { format } from "date-fns";
import SessionScheduleModal from "./SessionScheduleModal";

const ChatHeader = ({ session, currentUser, onScheduleSession }) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const otherUser =
    session.participants.find((id) => id !== currentUser.uid) ===
    session.requesterId
      ? session.requesterName
      : session.recipientName;

  const isSessionTimeValid = () => {
    if (!session.date || !session.time) return false;
    const sessionDateTime = new Date(`${session.date}T${session.time}`);
    const now = new Date();
    const tenMinutesBefore = new Date(sessionDateTime.getTime() - 10 * 60000);
    const thirtyMinutesAfter = new Date(
      sessionDateTime.getTime() +
        (parseInt(session.duration || 30) + 30) * 60000
    );

    return now >= tenMinutesBefore && now <= thirtyMinutesAfter;
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          className="h-10 w-10 rounded-full"
          src={session.otherUser?.photoURL}
          alt={otherUser}
        />
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {otherUser}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {session.skillToTeach} for {session.skillToLearn}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {session.meetingLink && isSessionTimeValid() && (
          <a
            href={session.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <FiVideo className="mr-1" /> Join Meeting
          </a>
        )}

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <FiClock className="mr-1" /> Schedule
        </button>

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
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                Schedule Session
              </button>
              {session.meetingLink && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Copy Meeting Link
                </a>
              )}
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
