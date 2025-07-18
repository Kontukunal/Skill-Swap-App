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
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import UserCard from "../components/exchange/UserCard";
import ExchangeFilter from "../components/exchange/ExchangeFilter";
import ExchangeRequestModal from "../components/exchange/ExchangeRequestModal";

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        let q = query(usersRef, where("uid", "!=", currentUser.uid));

        // Apply filters if they exist
        if (filters.teach) {
          q = query(q, where("skillsToTeach", "array-contains", filters.teach));
        }
        if (filters.learn) {
          q = query(q, where("skillsToLearn", "array-contains", filters.learn));
        }

        const querySnapshot = await getDocs(q);
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push(doc.data());
        });
        setUsers(usersData);
      } catch (error) {
        toast.error("Failed to fetch users: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, filters]);

  const handleUserClick = async (user) => {
    try {
      setSelectedUser(user);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to fetch user details: " + error.message);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Find Skill Exchange Partners
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              Connect with people who want to share their skills and learn from
              you in return.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ExchangeFilter
            currentFilters={filters}
            onChange={handleFilterChange}
          />
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No users found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {users.map((user) => (
              <UserCard
                key={user.uid}
                user={user}
                onClick={() => handleUserClick(user)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {isModalOpen && userProfile && (
        <ExchangeRequestModal
          user={userProfile}
          onClose={() => setIsModalOpen(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ExchangePage;
