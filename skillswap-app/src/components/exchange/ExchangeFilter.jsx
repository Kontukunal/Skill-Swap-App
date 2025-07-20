import React, { useState } from "react";
import { FiX, FiFilter, FiMapPin, FiBook, FiAward } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const ExchangeFilter = ({ currentFilters, onChange }) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState(currentFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(filters);
  };

  const handleReset = () => {
    const resetFilters = { teach: "", learn: "", location: "" };
    setFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl shadow-xl backdrop-blur-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <FiFilter className="text-indigo-500" /> Filter Options
        </h3>
        <button
          onClick={handleReset}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label
              htmlFor="teach"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FiAward className="text-indigo-500" /> I can teach
            </label>
            <div className="relative">
              <input
                type="text"
                name="teach"
                id="teach"
                value={filters.teach}
                onChange={handleChange}
                className={`block w-full rounded-xl py-2 px-3 pl-10 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  theme.mode === "dark"
                    ? "bg-gray-700/50 border-gray-600 text-white"
                    : "bg-white/80 border-gray-200 text-gray-900"
                } border`}
                placeholder="Any skill"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiAward className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="learn"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FiBook className="text-purple-500" /> I want to learn
            </label>
            <div className="relative">
              <input
                type="text"
                name="learn"
                id="learn"
                value={filters.learn}
                onChange={handleChange}
                className={`block w-full rounded-xl py-2 px-3 pl-10 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  theme.mode === "dark"
                    ? "bg-gray-700/50 border-gray-600 text-white"
                    : "bg-white/80 border-gray-200 text-gray-900"
                } border`}
                placeholder="Any skill"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBook className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="location"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FiMapPin className="text-pink-500" /> Location
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                id="location"
                value={filters.location}
                onChange={handleChange}
                className={`block w-full rounded-xl py-2 px-3 pl-10 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  theme.mode === "dark"
                    ? "bg-gray-700/50 border-gray-600 text-white"
                    : "bg-white/80 border-gray-200 text-gray-900"
                } border`}
                placeholder="Any location"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              theme.mode === "dark"
                ? "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } shadow-sm`}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ExchangeFilter;
