import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceForm from "../components/resources/ResourceForm";
import { useTheme } from "../contexts/ThemeContext";

const ResourcesPage = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const resourcesData = [];
      querySnapshot.forEach((doc) => {
        resourcesData.push({ id: doc.id, ...doc.data() });
      });
      setResources(resourcesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (resourceData) => {
    try {
      await addDoc(collection(db, "resources"), {
        ...resourceData,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Anonymous",
        authorPhoto: currentUser.photoURL || "",
        createdAt: serverTimestamp(),
        likes: [],
      });
      setIsFormOpen(false);
      toast.success("Resource shared successfully!");
    } catch (error) {
      toast.error("Failed to share resource: " + error.message);
    }
  };

  const filteredResources =
    filter === "all"
      ? resources
      : resources.filter((resource) => resource.skill === filter);

  const uniqueSkills = Array.from(new Set(resources.map((r) => r.skill)));

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {theme.mode === "dark" ? (
          <>
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-900 opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-purple-900 opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          </>
        ) : (
          <>
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-100 opacity-40 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-purple-100 opacity-40 blur-3xl animate-blob animation-delay-2000"></div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-700/5 dark:to-purple-700/5"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  Community <span className="gradient-text">Resources</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                  Discover and share valuable learning materials with the
                  SkillSwap community.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Share Resource
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by skill:
              </span>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Skills</option>
                  {uniqueSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredResources.length} resources found
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No resources found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Be the first to share a resource for{" "}
              {filter === "all" ? "any skill" : filter}!
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Share Resource
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  currentUser={currentUser}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ResourceForm
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmit}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourcesPage;
