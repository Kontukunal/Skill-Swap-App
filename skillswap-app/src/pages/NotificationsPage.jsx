import React from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../contexts/AuthContext";
import { FiCheck, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  const { currentUser } = useAuth();
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No notifications found
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-6 py-4 ${notification.read ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p
                      className={`font-medium ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    {notification.type === "exchange_request" && (
                      <div className="mt-2">
                        <a
                          href={notification.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <FiClock className="mr-1" /> Join Meeting
                        </a>
                        <Link
                          to={`/sessions`}
                          className="ml-4 inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:underline"
                        >
                          View details
                        </Link>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Mark as read"
                  >
                    <FiCheck className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt?.toDate()).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
