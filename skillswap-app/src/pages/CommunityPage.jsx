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
import CommunityPost from "../components/community/CommunityPost";
import CommunityPostForm from "../components/community/CommunityPostForm";
import SearchAndSort from "../components/community/SearchAndSort";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useTheme } from "../contexts/ThemeContext";

const CommunityPage = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories] = useState([
    "General",
    "Questions",
    "Feedback",
    "Success Stories",
    "Tips & Tricks",
  ]);

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
        category: activeCategory !== "all" ? activeCategory : null,
      });
      setNewPost("");
      toast.success("Post shared successfully!", {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
    } catch (error) {
      toast.error("Failed to share post: " + error.message, {
        style: {
          background: theme.mode === "dark" ? "#1F2937" : "#F3F4F6",
          color: theme.mode === "dark" ? "#F9FAFB" : "#111827",
        },
      });
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.authorName &&
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === "all" ||
      (post.category && post.category === activeCategory);

    return matchesSearch && matchesCategory;
  });

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
    <div className="min-h-screen">
      {theme.mode === "dark" ? (
        <>
          <div className="fixed top-20 left-10 w-64 h-64 rounded-full bg-indigo-900 opacity-10 blur-3xl -z-10"></div>
          <div className="fixed bottom-20 right-10 w-64 h-64 rounded-full bg-purple-900 opacity-10 blur-3xl -z-10"></div>
        </>
      ) : (
        <>
          <div className="fixed top-20 left-10 w-64 h-64 rounded-full bg-indigo-100 opacity-40 blur-3xl -z-10"></div>
          <div className="fixed bottom-20 right-10 w-64 h-64 rounded-full bg-purple-100 opacity-40 blur-3xl -z-10"></div>
        </>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">
            Community Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect, collaborate and grow with fellow skill enthusiasts. Share
            your journey and learn from others.
          </p>
        </motion.div>

        <div className="space-y-8">
          {currentUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CommunityPostForm
                onSubmit={handleSubmit}
                value={newPost}
                onChange={setNewPost}
                currentUser={currentUser}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categories={categories}
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SearchAndSort
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              setSortOption={setSortOption}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categories={categories}
            />
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : sortedPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 glass rounded-2xl p-8"
            >
              <div className="text-5xl mb-4">👋</div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                {searchQuery ? "No matches found" : "Community is quiet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {searchQuery
                  ? "Try different keywords or categories"
                  : currentUser
                    ? "Be the first to start a conversation!"
                    : "Sign in to make the first post"}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-6">
                {sortedPosts.map((post) => (
                  <CommunityPost
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
