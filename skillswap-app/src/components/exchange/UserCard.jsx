import React from "react";
import { motion } from "framer-motion";
import { FiUser, FiAward, FiBook } from "react-icons/fi";
import ProfilePlaceholder from "../../assets/profile-placeholder.svg";
import { useTheme } from "../../contexts/ThemeContext";

const UserCard = ({ user, onClick }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass rounded-2xl overflow-hidden shadow-lg border ${theme.mode === "dark" ? "border-gray-700" : "border-gray-200"} backdrop-blur-sm cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="relative">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
              src={user.photoURL || ProfilePlaceholder}
              alt={user.displayName}
            />
            <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1">
              <FiUser className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.displayName || "Anonymous"}
            </h3>
            {user.bio && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <FiAward className="text-indigo-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Can Teach:
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
              {user.skillsToTeach?.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300">
                  +{user.skillsToTeach.length - 3}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <FiBook className="text-green-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Wants to Learn:
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
              {user.skillsToLearn?.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300">
                  +{user.skillsToLearn.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
