import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  FiMessageSquare,
  FiVideo,
  FiClock,
  FiUser,
  FiSearch,
} from "react-icons/fi";

const ExchangeSessionsPage = () => {
  const { currentUser } = useAuth();
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

  const startChat = async (participantId) => {
    // Implement your chat initialization logic here
    console.log("Starting chat with:", participantId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Exchange Sessions
        </h1>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search sessions..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "upcoming"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pending"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "completed"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
          </button>
        </nav>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No {activeTab} sessions found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
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
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {session.requesterId === currentUser.uid ? (
                          <>
                            You requested{" "}
                            <span className="text-indigo-600">
                              {session.skillToLearn}
                            </span>{" "}
                            from {session.recipientName}
                          </>
                        ) : (
                          <>
                            {session.requesterName} requested{" "}
                            <span className="text-indigo-600">
                              {session.skillToTeach}
                            </span>{" "}
                            from you
                          </>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <FiClock className="inline mr-1" />
                        {new Date(
                          `${session.date}T${session.time}`
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <FiVideo className="mr-1" /> Join Meeting
                      </a>
                    )}
                    <button
                      onClick={() =>
                        startChat(
                          session.requesterId === currentUser.uid
                            ? session.recipientId
                            : session.requesterId
                        )
                      }
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiMessageSquare className="mr-1" /> Message
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Skill Exchange:</strong> {session.skillToTeach} for{" "}
                    {session.skillToLearn}
                  </p>
                  {session.message && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <strong>Note:</strong> {session.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExchangeSessionsPage;
