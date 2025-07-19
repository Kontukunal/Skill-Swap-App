import React from "react";
import { FiSearch } from "react-icons/fi";
import SessionCard from "./SessionCard";

const SessionSidebar = ({
  sessions,
  activeSession,
  searchTerm,
  onSearchChange,
  onSessionSelect,
}) => {
  // Get unique sessions by participant
  const uniqueSessions = sessions.reduce((acc, session) => {
    const otherUserId = session.participants.find(
      (id) => id !== session.requesterId
    );
    if (!acc[otherUserId]) {
      acc[otherUserId] = session;
    }
    return acc;
  }, {});

  const filteredSessions = Object.values(uniqueSessions).filter((session) => {
    const searchLower = searchTerm.toLowerCase();
    const otherUser = session.otherUser || {};

    return (
      otherUser.displayName?.toLowerCase().includes(searchLower) ||
      session.skillToTeach?.toLowerCase().includes(searchLower) ||
      session.skillToLearn?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          My Exchanges
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search exchanges..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No exchanges found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isActive={activeSession?.id === session.id}
                onClick={() => onSessionSelect(session)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSidebar;
