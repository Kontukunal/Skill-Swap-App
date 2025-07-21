import React, { useState, useEffect, useRef } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useAuth } from "../../contexts/AuthContext";
import { FiBell, FiCheck, FiClock, FiVideo, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { currentUser } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications(
    currentUser?.uid
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markAsRead(notification.id);
      }

      if (notification.type === "exchange") {
        navigate(`/exchanges/${notification.relatedId}`);
      } else if (notification.type === "session") {
        navigate(`/sessions/${notification.relatedId}`);
      } else if (notification.meetingLink) {
        window.open(notification.meetingLink, "_blank");
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative"
        aria-label="Notifications"
      >
        <FiBell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
        >
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300">
              Notifications
            </div>
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      !notification.read ? "bg-blue-50 dark:bg-gray-700" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        {notification.meetingLink && (
                          <div className="mt-2">
                            <a
                              href={notification.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiVideo className="mr-1" /> Join Meeting
                            </a>
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label="Mark as read"
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">
                        {new Date(
                          notification.createdAt?.toDate()
                        ).toLocaleString()}
                      </p>
                      {!notification.read && (
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
              <Link
                to="/notifications"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationBell;
