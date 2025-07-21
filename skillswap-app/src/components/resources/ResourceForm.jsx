import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiX, FiLink, FiBook, FiUser, FiEdit2 } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

const ResourceForm = ({ onClose, onSubmit, currentUser }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    skill: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${theme.mode === "dark" ? "bg-gray-800" : "bg-white"} glass`}
              >
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900 dark:text-white"
                  >
                    Share a Resource
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={onClose}
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <FiEdit2 className="mr-2" /> Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Awesome React Tutorial"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <FiBook className="mr-2" /> Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="mt-1 block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of the resource..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <FiLink className="mr-2" /> URL
                    </label>
                    <div className="mt-1 relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLink className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="url"
                        id="url"
                        required
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3"
                        placeholder="https://example.com"
                        value={formData.url}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="skill"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <FiUser className="mr-2" /> Related Skill
                    </label>
                    <div className="mt-1 relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="skill"
                        id="skill"
                        required
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3"
                        placeholder="e.g. JavaScript, Design, etc."
                        value={formData.skill}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <motion.button
                      type="button"
                      onClick={onClose}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      Share Resource
                    </motion.button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ResourceForm;
