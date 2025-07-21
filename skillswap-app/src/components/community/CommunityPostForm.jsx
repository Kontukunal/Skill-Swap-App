import React from "react";
import { FiMessageSquare, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

const CommunityPostForm = ({
  onSubmit,
  value,
  onChange,
  currentUser,
  activeCategory,
  setActiveCategory,
  categories,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="glass rounded-2xl shadow-xl overflow-hidden border border-opacity-20 dark:border-opacity-20 border-gray-300 dark:border-gray-600"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            {currentUser?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <textarea
                rows={3}
                className="block w-full rounded-xl border-0 bg-white/70 dark:bg-gray-800/70 shadow-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm backdrop-blur-sm"
                placeholder="Share your thoughts, questions or experiences..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {["all", ...categories].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {category === "all" ? "All Topics" : category}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
                >
                  <FiPlus className="mr-2" />
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityPostForm;
