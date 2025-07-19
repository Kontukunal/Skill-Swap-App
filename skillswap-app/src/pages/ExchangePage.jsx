import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import UserCard from "../components/exchange/UserCard";
import ExchangeFilter from "../components/exchange/ExchangeFilter";
import ExchangeRequestModal from "../components/exchange/ExchangeRequestModal";
import {
  sendExchangeRequestNotification,
  sendExchangeConfirmationNotification,
} from "../services/notificationService";
import { generateMeetingLink } from "../utils/meetingUtils";

const ExchangePage = () => {
  const { currentUser } = useAuth();
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
  };

  const handleSendRequest = async (requestData) => {
    try {
      const meetingLink = generateMeetingLink();

      // Create exchange document
      const exchangeRef = await addDoc(collection(db, "exchanges"), {
        participants: [currentUser.uid, userProfile.uid],
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName,
        requesterPhoto: currentUser.photoURL,
        recipientId: userProfile.uid,
        recipientName: userProfile.displayName,
        recipientPhoto: userProfile.photoURL,
        skillToTeach: requestData.skillToTeach,
        skillToLearn: requestData.skillToLearn,
        status: "pending",
        meetingLink,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Create system message (strict structure)
      const systemMessage = {
        type: "system",
        text: `${currentUser.displayName} requested to exchange ${requestData.skillToTeach} for ${requestData.skillToLearn}`,
        meetingLink,
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderPhoto: currentUser.photoURL,
      };

      await addDoc(
        collection(db, "exchanges", exchangeRef.id, "messages"),
        systemMessage
      );

      // Create user message if provided (strict structure)
      if (requestData.message) {
        const userMessage = {
          type: "text",
          text: requestData.message,
          timestamp: serverTimestamp(),
          senderId: currentUser.uid,
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
        };
        await addDoc(
          collection(db, "exchanges", exchangeRef.id, "messages"),
          userMessage
        );
      }

      // Send notification
      await sendExchangeRequestNotification(
        userProfile.uid,
        currentUser.displayName,
        requestData.skillToTeach,
        requestData.skillToLearn,
        exchangeRef.id,
        meetingLink
      );

      toast.success("Request sent successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Failed to send request. Please check your permissions.");
    }
  };

  const matches = findSkillMatches();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Find Skill Exchange Partners
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
          Connect with people who want to share their skills and learn from you.
        </p>
      </div>

      <div className="mb-6">
        <ExchangeFilter
          currentFilters={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setShowMatches(false)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              !showMatches
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Browse All
          </button>
          <button
            onClick={() => setShowMatches(true)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              showMatches
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Recommended Matches
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : showMatches ? (
        matches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map(({ user, score }) => (
              <UserCard
                key={user.id || user.uid}
                user={user}
                score={score}
                onClick={() => handleUserClick(user)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No skill matches found. Make sure you've added skills you can
              teach and want to learn in your profile.
            </p>
          </div>
        )
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id || user.uid}
              user={user}
              onClick={() => handleUserClick(user)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No users found matching your criteria. Try adjusting your filters.
          </p>
        </div>
      )}

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
