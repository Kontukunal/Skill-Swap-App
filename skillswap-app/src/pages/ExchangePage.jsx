import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UserCard from "../components/exchange/UserCard";
import ExchangeFilter from "../components/exchange/ExchangeFilter";
import ExchangeRequestModal from "../components/exchange/ExchangeRequestModal";
import { generateMeetingLink } from "../utils/meetingUtils";
import { FiFilter, FiUsers, FiStar, FiSearch } from "react-icons/fi";

const ExchangePage = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    teach: "",
    learn: "",
    location: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showMatches, setShowMatches] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        let q = query(usersRef, where("uid", "!=", currentUser.uid));

        if (filters.teach && !filters.learn) {
          q = query(q, where("skillsToTeach", "array-contains", filters.teach));
        } else if (filters.learn && !filters.teach) {
          q = query(q, where("skillsToLearn", "array-contains", filters.learn));
        }

        const querySnapshot = await getDocs(q);
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users. Please try different filters.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, filters]);

  const findSkillMatches = () => {
    if (!currentUser?.skillsToTeach || !currentUser?.skillsToLearn) return [];

    return users
      .filter((user) => {
        const hasSkillsIWant = currentUser.skillsToLearn.some((skill) =>
          user.skillsToTeach?.includes(skill)
        );
        const wantsSkillsIHave = user.skillsToLearn?.some((skill) =>
          currentUser.skillsToTeach.includes(skill)
        );
        return hasSkillsIWant && wantsSkillsIHave;
      })
      .map((user) => ({
        user,
        score: calculateMatchScore(currentUser, user),
      }))
      .sort((a, b) => b.score - a.score);
  };

  const calculateMatchScore = (user1, user2) => {
    let score = 0;
    user1.skillsToLearn.forEach((skill) => {
      if (user2.skillsToTeach?.includes(skill)) score += 10;
    });
    user2.skillsToLearn?.forEach((skill) => {
      if (user1.skillsToTeach.includes(skill)) score += 10;
    });
    if (
      user1.location &&
      user2.location &&
      user1.location.toLowerCase() === user2.location.toLowerCase()
    ) {
      score += 5;
    }
    return score;
  };

  const handleUserClick = async (user) => {
    try {
      setSelectedUser(user);
      const userDoc = await getDoc(doc(db, "users", user.id || user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  const handleFilterChange = (newFilters) => {
    if (newFilters.teach && newFilters.learn) {
      toast.error(
        "Please filter by either 'I can teach' or 'I want to learn' at a time"
      );
      return;
    }
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleSendRequest = async (requestData) => {
    try {
      if (!userProfile?.uid) {
        throw new Error("Recipient user data is not available");
      }

      const meetingLink = generateMeetingLink();
      const exchangeData = {
        participants: [currentUser.uid, userProfile.uid],
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName,
        requesterPhoto: currentUser.photoURL,
        recipientId: userProfile.uid,
        recipientName: userProfile.displayName,
        recipientPhoto: userProfile.photoURL,
        status: "pending",
        meetingLink,
        date: requestData.date,
        time: requestData.time,
        duration: requestData.duration,
        message: requestData.message,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const exchangesRef = collection(db, "exchanges");
      const exchangeRef = await addDoc(exchangesRef, exchangeData);

      const notificationsRef = collection(db, "notifications");
      const batch = writeBatch(db);

      const recipientNotificationRef = doc(notificationsRef);
      batch.set(recipientNotificationRef, {
        userId: userProfile.uid,
        title: "New Exchange Request",
        message: `${currentUser.displayName} wants to exchange skills with you`,
        type: "exchange_request",
        meetingLink,
        relatedId: exchangeRef.id,
        read: false,
        createdAt: new Date(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderPhoto: currentUser.photoURL,
      });

      const requesterNotificationRef = doc(notificationsRef);
      batch.set(requesterNotificationRef, {
        userId: currentUser.uid,
        title: "Exchange Request Sent",
        message: `You requested to exchange skills with ${userProfile.displayName}`,
        type: "exchange_request",
        meetingLink,
        relatedId: exchangeRef.id,
        read: false,
        createdAt: new Date(),
        recipientId: userProfile.uid,
        recipientName: userProfile.displayName,
        recipientPhoto: userProfile.photoURL,
      });

      await batch.commit();

      toast.success("Exchange request sent successfully!");
      setIsModalOpen(false);
      navigate("/sessions", { state: { newExchangeId: exchangeRef.id } });
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error(error?.message || "Failed to send request");
    }
  };

  const matches = findSkillMatches();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {theme.mode === "dark" ? (
          <>
            <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-900/20 blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-pink-900/15 blur-3xl animate-blob animation-delay-4000"></div>
          </>
        ) : (
          <>
            <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-100/40 blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-100/40 blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-pink-100/30 blur-3xl animate-blob animation-delay-4000"></div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass p-8 rounded-3xl mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">
                Skill Exchange Network
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Connect with people who want to share their skills and learn
                from you.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  showFilters
                    ? "bg-indigo-600 text-white shadow-lg"
                    : theme.mode === "dark"
                      ? "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiFilter className="h-5 w-5" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <button
                onClick={() => setShowMatches(!showMatches)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  showMatches
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : theme.mode === "dark"
                      ? "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiStar className="h-5 w-5" />
                {showMatches ? "Show All" : "Show Matches"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 overflow-hidden"
              >
                <ExchangeFilter
                  currentFilters={filters}
                  onChange={handleFilterChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : showMatches ? (
          matches.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {matches.map(({ user, score }) => (
                <motion.div
                  key={user.id || user.uid}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserCard
                    user={user}
                    score={score}
                    onClick={() => handleUserClick(user)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="glass p-12 rounded-3xl text-center">
              <div className="mx-auto h-24 w-24 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                <FiUsers className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                No matches found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                We couldn't find any skill matches. Try adjusting your profile
                skills or browse all users instead.
              </p>
              <button
                onClick={() => setShowMatches(false)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Browse All Users
              </button>
            </div>
          )
        ) : users.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {users.map((user) => (
              <motion.div
                key={user.id || user.uid}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <UserCard user={user} onClick={() => handleUserClick(user)} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass p-12 rounded-3xl text-center">
            <div className="mx-auto h-24 w-24 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
              <FiSearch className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Try adjusting your filters or check back later as more users join
              the platform.
            </p>
            <button
              onClick={() => setFilters({ teach: "", learn: "", location: "" })}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {isModalOpen && userProfile && (
        <ExchangeRequestModal
          user={userProfile}
          onClose={() => setIsModalOpen(false)}
          currentUser={currentUser}
          onSubmit={handleSendRequest}
        />
      )}
    </div>
  );
};

export default ExchangePage;
