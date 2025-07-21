import React from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import SessionCard from "./SessionCard";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const SessionSidebar = ({
  sessions,
  activeSession,
  searchTerm,
  onSearchChange,
  onSessionSelect,
}) => {
  const { theme } = useTheme();

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
    <div
      className={`w-80 border-r ${theme.mode === "dark" ? "border-gray-700 bg-gray-800/80" : "border-gray-200 bg-white/80"} flex flex-col backdrop-blur-lg`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Exchanges
          </h2>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search exchanges..."
            className={`block w-full pl-10 pr-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${theme.mode === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? "No matching exchanges found" : "No exchanges yet"}
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
