import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";
import ExchangeSessionCard from "../components/exchange/ExchangeSessionCard";
import { motion } from "framer-motion";

const ExchangeSessionsPage = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "exchanges"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const sessionsData = [];
        snapshot.forEach((doc) => {
          sessionsData.push({ id: doc.id, ...doc.data() });
        });
        setSessions(sessionsData);
        setLoading(false);
      },
      (error) => {
        toast.error("Error loading sessions: " + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const filteredSessions = sessions.filter((session) => {
    const now = new Date();
    const sessionDate = new Date(`${session.date}T${session.time}`);

    if (activeTab === "upcoming") {
      return sessionDate > now && session.status === "accepted";
    } else if (activeTab === "pending") {
      return (
        session.status === "pending" && session.recipientId === currentUser.uid
      );
    } else {
      return (
        sessionDate <= now ||
        (session.status !== "pending" && session.status !== "accepted")
      );
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Exchange Sessions
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
          Manage your upcoming skill exchange sessions
        </p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "upcoming"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pending"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "past"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Past Sessions
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No {activeTab} sessions found
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-6"
        >
          {filteredSessions.map((session) => (
            <ExchangeSessionCard
              key={session.id}
              session={session}
              currentUserId={currentUser.uid}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ExchangeSessionsPage;
