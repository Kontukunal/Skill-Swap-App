// SearchAndSort.jsx
import React from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const SearchAndSort = ({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  activeCategory,
  setActiveCategory,
  categories,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiSearch className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 rounded-xl border-0 bg-white/70 dark:bg-gray-800/70 shadow-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm backdrop-blur-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiFilter className="h-5 w-5" />
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 rounded-xl border-0 bg-white/70 dark:bg-gray-800/70 shadow-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white sm:text-sm backdrop-blur-sm appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
            <option value="mostCommented">Most Commented</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", ...categories].map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 shadow-sm backdrop-blur-sm"
            }`}
          >
            {category === "all" ? "All Topics" : category}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchAndSort;
