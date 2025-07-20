import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiAward, FiBook } from "react-icons/fi";
import ProfilePlaceholder from "../../assets/profile-placeholder.svg";
import { useTheme } from "../../contexts/ThemeContext";

const SkillMatchCard = ({ user, score, onClick }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass rounded-2xl overflow-hidden shadow-lg border ${theme.mode === "dark" ? "border-indigo-800" : "border-indigo-200"} backdrop-blur-sm cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="relative">
              <img
                className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
                src={user.photoURL || ProfilePlaceholder}
                alt={user.displayName}
              />
              <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1">
                <FiStar className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.displayName || "Anonymous"}
              </h3>
              <div className="flex items-center mt-1">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Match: {score}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <FiAward className="text-indigo-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                You can learn from them:
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skillsToTeach?.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <FiBook className="text-green-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                They want to learn from you:
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skillsToLearn?.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillMatchCard;
