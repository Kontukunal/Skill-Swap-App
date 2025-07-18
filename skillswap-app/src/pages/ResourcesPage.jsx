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
import { motion } from "framer-motion";
import ResourceCard from "../components/resources/ResourceCard";
import ResourceForm from "../components/resources/ResourceForm";

const ResourcesPage = () => {
  const { currentUser } = useAuth();
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Learning Resources
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              Helpful articles, videos, and tutorials shared by the community.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Share Resource
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by skill:
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Skills</option>
              {Array.from(new Set(resources.map((r) => r.skill))).map(
                (skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No resources found. Be the first to share!
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                currentUser={currentUser}
              />
            ))}
          </motion.div>
        )}
      </div>

      {isFormOpen && (
        <ResourceForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ResourcesPage;
