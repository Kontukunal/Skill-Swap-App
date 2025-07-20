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
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

  const findMatchingSkills = (currentUser, otherUser) => {
    if (!currentUser?.skillsToTeach || !otherUser?.skillsToLearn) return null;

    const potentialSkillsToTeach = currentUser.skillsToTeach.filter((skill) =>
      otherUser.skillsToLearn.includes(skill)
    );

    const potentialSkillsToLearn = otherUser.skillsToTeach.filter((skill) =>
      currentUser.skillsToLearn.includes(skill)
    );

    if (
      potentialSkillsToTeach.length === 0 ||
      potentialSkillsToLearn.length === 0
    ) {
      return null;
    }

    return {
      skillToTeach: potentialSkillsToTeach[0],
      skillToLearn: potentialSkillsToLearn[0],
    };
  };

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
      if (!userProfile?.uid) {
        throw new Error("Recipient user data is not available");
      }

      const existingExchangeQuery = query(
        collection(db, "exchanges"),
        where("participants", "array-contains", currentUser.uid)
      );
      const querySnapshot = await getDocs(existingExchangeQuery);

      let exchangeRef;
      let isNewExchange = true;
      const meetingLink = requestData.meetingLink; // Use the link from requestData

      // Find existing exchange
      querySnapshot.forEach((doc) => {
        const exchange = doc.data();
        if (exchange.participants.includes(userProfile.uid)) {
          exchangeRef = doc.ref;
          isNewExchange = false;
        }
      });

      if (isNewExchange) {
        exchangeRef = await addDoc(collection(db, "exchanges"), {
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
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(exchangeRef, {
          meetingLink,
          date: requestData.date,
          time: requestData.time,
          duration: requestData.duration,
          updatedAt: serverTimestamp(),
        });
      }

      // Create detailed meeting message
      const meetingMessage = `Meeting scheduled for ${requestData.date} at ${requestData.time} (${requestData.duration} minutes)`;

      // Add video call message with all details
      await addDoc(collection(db, "exchanges", exchangeRef.id, "messages"), {
        type: "video",
        text: meetingMessage,
        meetingLink,
        date: requestData.date,
        time: requestData.time,
        duration: requestData.duration,
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderPhoto: currentUser.photoURL,
      });

      // Add user's custom message if provided
      if (requestData?.message) {
        await addDoc(collection(db, "exchanges", exchangeRef.id, "messages"), {
          type: "text",
          text: requestData.message,
          timestamp: serverTimestamp(),
          senderId: currentUser.uid,
          senderName: currentUser.displayName,
          senderPhoto: currentUser.photoURL,
        });
      }

      // Send notification with meeting details
      await sendExchangeRequestNotification(
        userProfile.uid,
        currentUser.displayName,
        exchangeRef.id,
        meetingLink,
        meetingMessage 
      );

      toast.success(
        isNewExchange ? "Meeting request sent!" : "Added to existing exchange"
      );
      setIsModalOpen(false);
      navigate(`/sessions/${exchangeRef.id}`);
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error(error?.message || "Failed to send request");
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
          // Remove skill selection props if they're no longer needed
        />
      )}
    </div>
  );
};

export default ExchangePage;
