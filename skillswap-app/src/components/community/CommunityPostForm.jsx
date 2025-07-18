import React from "react";
import { FiMessageSquare } from "react-icons/fi";

const CommunityPostForm = ({ onSubmit, value, onChange, currentUser }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={currentUser?.photoURL || ""}
            alt={currentUser?.displayName || "User"}
          />
          <div className="ml-4 flex-1">
            <textarea
              rows={3}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="What's on your mind?"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <FiMessageSquare className="mr-1" />
                <span className="text-sm">Share your thoughts</span>
              </div>
              <button
                onClick={onSubmit}
                disabled={!value.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostForm;
