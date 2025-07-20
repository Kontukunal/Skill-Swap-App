import React from "react";
import { FiMessageSquare } from "react-icons/fi";

const CommunityPostForm = ({ onSubmit, value, onChange, currentUser }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-300">
              {currentUser?.displayName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="ml-4 flex-1">
            <form onSubmit={handleSubmit}>
              <textarea
                rows={3}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="What's on your mind?"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostForm;
