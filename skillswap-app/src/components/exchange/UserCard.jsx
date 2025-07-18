import React from "react";
import { motion } from "framer-motion";
import ProfilePlaceholder from "../../assets/profile-placeholder.svg";

const UserCard = ({ user, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={user.photoURL || ProfilePlaceholder}
            alt={user.displayName}
          />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {user.displayName || "Anonymous"}
            </h3>
            {user.bio && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Can Teach:
          </h4>
          <div className="mt-1 flex flex-wrap gap-1">
            {user.skillsToTeach?.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              >
                {skill}
              </span>
            ))}
            {user.skillsToTeach?.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{user.skillsToTeach.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Wants to Learn:
          </h4>
          <div className="mt-1 flex flex-wrap gap-1">
            {user.skillsToLearn?.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                {skill}
              </span>
            ))}
            {user.skillsToLearn?.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{user.skillsToLearn.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
