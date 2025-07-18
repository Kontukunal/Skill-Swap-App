import React from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiHeart, FiMessageSquare } from "react-icons/fi";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

const ResourceCard = ({ resource, currentUser }) => {
  const isLiked = resource.likes?.includes(currentUser?.uid);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like resources");
      return;
    }

    try {
      const resourceRef = doc(db, "resources", resource.id);
      if (isLiked) {
        await updateDoc(resourceRef, {
          likes: arrayRemove(currentUser.uid),
        });
        toast.success("Removed from your liked resources");
      } else {
        await updateDoc(resourceRef, {
          likes: arrayUnion(currentUser.uid),
        });
        toast.success("Added to your liked resources");
      }
    } catch (error) {
      toast.error("Failed to update like: " + error.message);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start">
          {resource.authorPhoto ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={resource.authorPhoto}
              alt={resource.authorName}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600">
                {resource.authorName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {resource.authorName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(resource.createdAt?.toDate()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {resource.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {resource.description}
          </p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              {resource.skill}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center text-sm ${isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
            >
              <FiHeart className="mr-1" />
              {resource.likes?.length || 0}
            </button>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiMessageSquare className="mr-1" />
              {resource.comments?.length || 0}
            </div>
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FiExternalLink className="mr-1" /> Visit
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
