import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
              : theme.mode === "dark"
                ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/50"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md"
          }`}
        >
          All Categories
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                : theme.mode === "dark"
                  ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/50"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;
