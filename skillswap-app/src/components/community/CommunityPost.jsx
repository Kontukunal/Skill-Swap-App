import React, { useState, Fragment } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiMessageSquare, FiMoreHorizontal } from "react-icons/fi";
import { db } from "../../config/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Menu, Transition } from "@headlessui/react";

const CommunityPost = ({ post, currentUser }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const isLiked = post.likes?.includes(currentUser?.uid);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const postRef = doc(db, "communityPosts", post.id);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
      }
    } catch (error) {
      toast.error("Failed to update like: " + error.message);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }

    try {
      const postRef = doc(db, "communityPosts", post.id);
      await updateDoc(postRef, {
        comments: arrayUnion({
          userId: currentUser.uid,
          userName: currentUser.displayName || "Anonymous",
          userPhoto: currentUser.photoURL || "",
          text: comment,
          createdAt: new Date(),
        }),
      });
      setComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment: " + error.message);
    }
  };

  const handleDeletePost = async () => {
    // Implement delete functionality if needed
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            {post.authorPhoto ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={post.authorPhoto}
                alt={post.authorName}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">
                  {post.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {post.authorName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt?.toDate()).toLocaleString()}
              </p>
            </div>
          </div>

          {post.authorId === currentUser?.uid && (
            <Menu as="div" className="relative">
              <Menu.Button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
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
                        className={`${active ? "bg-gray-100 dark:bg-gray-700" : ""} block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        Delete Post
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>

        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center text-sm ${isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
            >
              <FiHeart className="mr-1" />
              {post.likes?.length || 0}
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center text-sm text-gray-500 dark:text-gray-400"
            >
              <FiMessageSquare className="mr-1" />
              {post.comments?.length || 0}
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-6 space-y-4">
            {post.comments?.map((comment, index) => (
              <div key={index} className="flex items-start">
                {comment.userPhoto ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={comment.userPhoto}
                    alt={comment.userName}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">
                      {comment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-white">
                      {comment.userName}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {comment.text}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(comment.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-4 flex">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-l-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommunityPost;
