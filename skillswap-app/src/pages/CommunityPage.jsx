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
import CommunityPost from "../components/community/CommunityPost";
import CommunityPostForm from "../components/community/CommunityPostForm";

const CommunityPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "communityPosts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await addDoc(collection(db, "communityPosts"), {
        content: newPost,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Anonymous",
        authorPhoto: currentUser.photoURL || "",
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
      });
      setNewPost("");
      toast.success("Post shared successfully!");
    } catch (error) {
      toast.error("Failed to share post: " + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Community Forum
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              Ask questions, share experiences, and connect with other learners.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <CommunityPostForm
            onSubmit={handleSubmit}
            value={newPost}
            onChange={setNewPost}
            currentUser={currentUser}
          />
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No posts yet. Be the first to share!
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
          >
            {posts.map((post) => (
              <CommunityPost
                key={post.id}
                post={post}
                currentUser={currentUser}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
