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
import SearchAndSort from "../components/community/SearchAndSort";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const CommunityPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

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

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.authorName &&
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = a.createdAt?.toDate
      ? a.createdAt.toDate()
      : new Date(a.createdAt);
    const dateB = b.createdAt?.toDate
      ? b.createdAt.toDate()
      : new Date(b.createdAt);

    switch (sortOption) {
      case "newest":
        return dateB - dateA;
      case "oldest":
        return dateA - dateB;
      case "mostLiked":
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      case "mostCommented":
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Community Forum
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ask questions and share experiences with other learners.
        </p>
      </div>

      {currentUser && (
        <CommunityPostForm
          onSubmit={handleSubmit}
          value={newPost}
          onChange={setNewPost}
          currentUser={currentUser}
        />
      )}

      <SearchAndSort
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "No posts match your search. Try different keywords."
              : "No posts yet. Be the first to share!"}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {sortedPosts.map((post) => (
            <CommunityPost
              key={post.id}
              post={post}
              currentUser={currentUser}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CommunityPage;
