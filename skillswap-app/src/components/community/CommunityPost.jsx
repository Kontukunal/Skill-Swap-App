import React, { useState, Fragment } from "react";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiMessageSquare,
  FiMoreHorizontal,
  FiTrash2,
} from "react-icons/fi";
import { db } from "../../config/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Menu, Transition } from "@headlessui/react";
import ReactMarkdown from "react-markdown";

const CommunityPost = ({ post, currentUser }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const isLiked = post.likes?.includes(currentUser?.uid);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like posts");
      return;
    }

    setIsLiking(true);
    try {
      const postRef = doc(db, "communityPosts", post.id);

      // Create a new object with only the fields we're updating
      const updateData = {
        likes: isLiked
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      };

      await updateDoc(postRef, updateData);
      toast.success(isLiked ? "Like removed" : "Post liked");
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Failed to update like: " + error.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }

    setIsCommenting(true);
    try {
      const postRef = doc(db, "communityPosts", post.id);
      const newComment = {
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        userPhoto: currentUser.photoURL || "",
        text: comment,
        createdAt: new Date(),
      };

      // Only update the comments array
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      setComment("");
      toast.success("Comment added");
      if (!showComments) setShowComments(true);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment: " + error.message);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!currentUser || currentUser.uid !== post.authorId) {
      toast.error("You can only delete your own posts");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      const postRef = doc(db, "communityPosts", post.id);
      await deleteDoc(postRef);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post: " + error.message);
      setIsDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return jsDate.toLocaleDateString(undefined, options);
  };

  if (isDeleting) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6"
    >
      <div className="p-6">
        {/* Post header with author info */}
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            {post.authorPhoto ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={post.authorPhoto}
                alt={post.authorName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                  e.target.className =
                    "h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center";
                  e.target.innerHTML = `<span class="text-gray-600 dark:text-gray-300">${post.authorName?.charAt(0).toUpperCase() || "U"}</span>`;
                }}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-300">
                  {post.authorName?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {post.authorName || "Anonymous"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </p>
              {post.category && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  {post.category}
                </span>
              )}
            </div>
          </div>

          {/* Post options menu (only for author) */}
          {post.authorId === currentUser?.uid && (
            <Menu as="div" className="relative">
              <Menu.Button
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                disabled={isDeleting}
              >
                <FiMoreHorizontal className="h-5 w-5" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDeletePost}
                        className={`${active ? "bg-gray-100 dark:bg-gray-700" : ""} w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 flex items-center`}
                      >
                        <FiTrash2 className="mr-2" />
                        Delete Post
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>

        {/* Post content */}
        <div className="mt-4">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>

        {/* Post actions (like, comment) */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              disabled={!currentUser || isLiking}
              className={`flex items-center text-sm ${isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"} ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:text-red-500"}`}
            >
              <FiHeart className={`mr-1 ${isLiking ? "animate-pulse" : ""}`} />
              {post.likes?.length || 0}
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500"
            >
              <FiMessageSquare className="mr-1" />
              {post.comments?.length || 0}
            </button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-6 space-y-4">
            {post.comments?.length > 0 ? (
              [...post.comments]
                .sort((a, b) => {
                  const dateA = a.createdAt?.toDate
                    ? a.createdAt.toDate()
                    : new Date(a.createdAt);
                  const dateB = b.createdAt?.toDate
                    ? b.createdAt.toDate()
                    : new Date(b.createdAt);
                  return dateB - dateA;
                })
                .map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start"
                  >
                    {comment.userPhoto ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={comment.userPhoto}
                        alt={comment.userName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                          e.target.className =
                            "h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center";
                          e.target.innerHTML = `<span class="text-gray-600 dark:text-gray-300 text-xs">${comment.userName?.charAt(0).toUpperCase() || "U"}</span>`;
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {comment.userName?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <div className="ml-3 flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <h4 className="text-xs font-medium text-gray-900 dark:text-white">
                          {comment.userName || "Anonymous"}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {comment.text}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                No comments yet
              </p>
            )}

            {/* Add comment form */}
            <div className="mt-4 flex">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Add a comment..."
                disabled={!currentUser || isCommenting}
                className={`flex-1 rounded-l-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${!currentUser ? "cursor-not-allowed opacity-50" : ""}`}
              />
              <button
                onClick={handleAddComment}
                disabled={!comment.trim() || !currentUser || isCommenting}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 ${!comment.trim() || !currentUser || isCommenting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isCommenting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommunityPost;
