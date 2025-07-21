import React from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../contexts/AuthContext";
import { FiCheck, FiClock, FiBell, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { notifications, markAsRead, markAllAsRead } = useNotifications(
    currentUser?.uid
  );

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-100 dark:bg-indigo-900 opacity-20 dark:opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-purple-100 dark:bg-purple-900 opacity-20 dark:opacity-10 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-white/30 dark:border-gray-700/30">
          <div className="px-8 py-6 border-b border-white/20 dark:border-gray-700/50 flex justify-between items-center bg-white/30 dark:bg-gray-800/30">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mr-4">
                <FiBell className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md"
            >
              Mark all as read
            </button>
          </div>

          <div className="divide-y divide-white/20 dark:divide-gray-700/50">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="px-8 py-16 text-center"
              >
                <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                  <FiBell className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No notifications yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Your notifications will appear here
                </p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-8 py-6 transition-all duration-300 ${notification.read ? "bg-white/30 dark:bg-gray-800/30" : "bg-indigo-50/50 dark:bg-indigo-900/20"}`}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${notification.read ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400" : "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"}`}
                    >
                      {notification.type === "exchange_request" ? (
                        <FiClock className="w-5 h-5" />
                      ) : (
                        <FiBell className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p
                            className={`font-medium ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          {notification.type === "exchange_request" && (
                            <div className="mt-3 flex flex-wrap gap-3">
                              <a
                                href={notification.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FiClock className="mr-1" /> Join Meeting
                              </a>
                              <Link
                                to={`/sessions`}
                                className="inline-flex items-center text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                View details
                              </Link>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className={`ml-4 p-1 rounded-full ${notification.read ? "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"}`}
                          title="Mark as read"
                        >
                          <FiCheck className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-xs mt-3 text-gray-500 dark:text-gray-400">
                        {new Date(
                          notification.createdAt?.toDate()
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-8 py-4 border-t border-white/20 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all notifications <FiChevronRight className="ml-1" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
