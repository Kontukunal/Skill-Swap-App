import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiExternalLink,
  FiHeart,
  FiMessageSquare,
  FiX,
  FiSend,
} from "react-icons/fi";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

const ResourceCard = ({ resource, currentUser }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
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

  const handleAddComment = async () => {
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const resourceRef = doc(db, "resources", resource.id);
      const newComment = {
        text: commentText,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Anonymous",
        authorPhoto: currentUser.photoURL || "",
        createdAt: new Date(),
      };

      await updateDoc(resourceRef, {
        comments: arrayUnion(newComment),
      });

      setCommentText("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment: " + error.message);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-2xl overflow-hidden hover-scale"
    >
      <div className="p-6">
        <div className="flex items-start mb-4">
          {resource.authorPhoto ? (
            <div className="relative">
              <img
                className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow"
                src={resource.authorPhoto}
                alt={resource.authorName}
              />
              <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {resource.authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {resource.authorName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(resource.createdAt?.toDate()).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {resource.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {resource.description}
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
              {resource.skill}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center text-sm ${isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"} transition-colors`}
            >
              <FiHeart className={`mr-1 ${isLiked ? "fill-current" : ""}`} />
              {resource.likes?.length || 0}
            </button>
            <button
              onClick={toggleComments}
              className={`flex items-center text-sm ${showComments ? "text-indigo-500 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"} transition-colors`}
            >
              <FiMessageSquare className="mr-1" />
              {resource.comments?.length || 0}
            </button>
          </div>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all"
          >
            <FiExternalLink className="mr-1" /> Visit
          </motion.a>
        </div>

        {showComments && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Comments ({resource.comments?.length || 0})
            </h4>

            <div className="flex mb-4">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              />

              <button
                onClick={handleAddComment}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all"
              >
                <FiSend />
              </button>
            </div>

            <div className="space-y-4">
              {resource.comments?.length > 0 ? (
                resource.comments
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((comment, index) => (
                    <div key={index} className="flex items-start">
                      {comment.authorPhoto ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover mr-3"
                          src={comment.authorPhoto}
                          alt={comment.authorName}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                          {comment.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {comment.authorName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResourceCard;
