import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FiMessageSquare, FiVideo, FiClock, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

const ExchangeSessionsPage = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "exchanges"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionsData = [];
      snapshot.forEach((doc) => {
        sessionsData.push({ id: doc.id, ...doc.data() });
      });
      setSessions(sessionsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.requesterName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "upcoming") {
      return session.status === "accepted" && matchesSearch;
    } else if (activeTab === "pending") {
      return session.status === "pending" && matchesSearch;
    } else {
      return session.status === "completed" && matchesSearch;
    }
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="fixed inset-0 pointer-events-none -z-10">
        {theme.mode === "dark" ? (
          <>
            <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-900 opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-900 opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          </>
        ) : (
          <>
            <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-100 opacity-20 blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-100 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Exchange Sessions
        </h1>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search sessions..."
            className={`block w-full pl-10 pr-3 py-2 rounded-lg ${theme.mode === "dark" ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"} border focus:outline-none focus:ring-2 sm:text-sm`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border-b border-gray-200 dark:border-gray-700 mb-8"
      >
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "upcoming"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "pending"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "completed"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Completed
          </button>
        </nav>
      </motion.div>

      {filteredSessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 dark:text-gray-400">
            No {activeTab} sessions found
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-6"
        >
          {filteredSessions.map((session) => (
            <motion.div
              key={session.id}
              whileHover={{ scale: 1.01 }}
              className={`rounded-xl overflow-hidden ${theme.mode === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} border shadow-lg`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={
                        session.requesterId === currentUser.uid
                          ? session.recipientPhoto
                          : session.requesterPhoto
                      }
                      alt={
                        session.requesterId === currentUser.uid
                          ? session.recipientName
                          : session.requesterName
                      }
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {session.requesterId === currentUser.uid ? (
                          <>
                            Exchange with{" "}
                            <span className="text-indigo-600 dark:text-indigo-400">
                              {session.recipientName}
                            </span>
                          </>
                        ) : (
                          <>
                            Exchange with{" "}
                            <span className="text-indigo-600 dark:text-indigo-400">
                              {session.requesterName}
                            </span>
                          </>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <FiClock className="inline mr-1" />
                        {formatDate(session.date)} at {formatTime(session.time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                      >
                        <FiVideo className="mr-2" /> Join Meeting
                      </a>
                    )}
                    <Link
                      to={`/sessions/${session.id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      <FiMessageSquare className="mr-2" /> Details
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg ${theme.mode === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}
                  >
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skill Exchange
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${theme.mode === "dark" ? "bg-indigo-900/50 text-indigo-200" : "bg-indigo-100 text-indigo-800"}`}
                      >
                        {session.skillToTeach}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        for
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${theme.mode === "dark" ? "bg-green-900/50 text-green-200" : "bg-green-100 text-green-800"}`}
                      >
                        {session.skillToLearn}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${theme.mode === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}
                  >
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </h4>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === "accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                          : session.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {session.status.charAt(0).toUpperCase() +
                        session.status.slice(1)}
                    </span>
                  </div>
                </div>

                {session.message && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Note
                    </h4>
                    <p
                      className={`text-sm ${theme.mode === "dark" ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {session.message}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ExchangeSessionsPage;
