import React, { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiMessageSquare,
  FiMoreHorizontal,
  FiTrash2,
  FiSend,
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
import { useTheme } from "../../contexts/ThemeContext";

const CommunityPost = ({ post, currentUser }) => {
  const { theme } = useTheme();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const isLiked = post.likes?.includes(currentUser?.uid);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like posts", {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
      return;
    }

    setIsLiking(true);
    try {
      const postRef = doc(db, "communityPosts", post.id);
      await updateDoc(postRef, {
        likes: isLiked
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      });
      toast.success(isLiked ? "Like removed" : "Post liked", {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Failed to update like: " + error.message, {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty", {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
      return;
    }
    if (!currentUser) {
      toast.error("Please login to comment", {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
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

      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      setComment("");
      toast.success("Comment added", {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
      if (!showComments) setShowComments(true);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment: " + error.message, {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!currentUser || currentUser.uid !== post.authorId) {
      toast.error("You can only delete your own posts", {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      const postRef = doc(db, "communityPosts", post.id);
      await deleteDoc(postRef);
      toast.success("Post deleted successfully", {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post: " + error.message, {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
      setIsDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(jsDate);
  };

  if (isDeleting) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="glass rounded-2xl shadow-lg overflow-hidden border border-opacity-20 dark:border-opacity-20 border-gray-300 dark:border-gray-600"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {post.authorPhoto ? (
              <img
                className="h-12 w-12 rounded-full object-cover shadow-md"
                src={post.authorPhoto}
                alt={post.authorName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                  e.target.className =
                    "h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md";
                  e.target.innerHTML = `<span>${post.authorName?.charAt(0).toUpperCase() || "U"}</span>`;
                }}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                <span>{post.authorName?.charAt(0).toUpperCase() || "U"}</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {post.authorName || "Anonymous"}
                </h3>
                {post.category && (
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium">
                    {post.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {post.authorId === currentUser?.uid && (
            <Menu as="div" className="relative">
              <Menu.Button
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
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
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-opacity-20 dark:border-opacity-20 border-gray-300 dark:border-gray-600">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDeletePost}
                        className={`${
                          active
                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            : "text-gray-700 dark:text-gray-300"
                        } w-full text-left px-4 py-2 text-sm flex items-center`}
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

        <div className="mt-4 pl-16">
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-6 pl-16 flex items-center gap-6">
          <button
            onClick={handleLike}
            disabled={!currentUser || isLiking}
            className={`flex items-center gap-1.5 text-sm font-medium ${
              isLiked
                ? "text-red-500"
                : "text-gray-500 dark:text-gray-400 hover:text-red-500"
            } ${!currentUser ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FiHeart
              className={`h-5 w-5 ${
                isLiked ? "fill-current" : ""
              } ${isLiking ? "animate-pulse" : ""}`}
            />
            <span>{post.likes?.length || 0}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 text-sm font-medium ${
              showComments
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <FiMessageSquare className="h-5 w-5" />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pl-16 space-y-4"
            >
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      {comment.userPhoto ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover shadow-sm"
                          src={comment.userPhoto}
                          alt={comment.userName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "";
                            e.target.className =
                              "h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm";
                            e.target.innerHTML = `<span class="text-xs">${comment.userName?.charAt(0).toUpperCase() || "U"}</span>`;
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                          <span className="text-xs">
                            {comment.userName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 shadow-sm backdrop-blur-sm">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 dark:text-gray-400 text-center py-4"
                >
                  No comments yet
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex gap-2"
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleAddComment()
                  }
                  placeholder="Add a comment..."
                  disabled={!currentUser || isCommenting}
                  className="flex-1 rounded-xl border-0 bg-white/70 dark:bg-gray-800/70 shadow-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm backdrop-blur-sm px-4 py-2"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim() || !currentUser || isCommenting}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCommenting ? (
                    "Sending..."
                  ) : (
                    <>
                      <FiSend className="h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CommunityPost;
