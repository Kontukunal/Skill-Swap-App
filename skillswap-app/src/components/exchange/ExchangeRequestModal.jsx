import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiX,
  FiClock,
  FiCalendar,
  FiMessageSquare,
  FiVideo,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { generateMeetingLink } from "../../utils/meetingUtils";
import { useTheme } from "../../contexts/ThemeContext";

const ExchangeRequestModal = ({ user, onClose, currentUser, onSubmit }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select date and time");
      return;
    }

    setIsSubmitting(true);
    try {
      const meetingLink = generateMeetingLink();
      const requestData = {
        message,
        date,
        time,
        duration: parseInt(duration),
        meetingLink,
      };
      await onSubmit(requestData);
      closeModal();
    } catch (error) {
      toast.error(error.message || "Failed to schedule call");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${theme.mode === "dark" ? "bg-gray-800/80" : "bg-white/80"} backdrop-blur-lg border ${theme.mode === "dark" ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-center">
                  <Dialog.Title className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    Schedule Exchange
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-6">
                  <div
                    className={`flex items-center space-x-4 mb-6 p-4 rounded-xl ${theme.mode === "dark" ? "bg-gray-700/20" : "bg-gray-100/50"} backdrop-blur-sm`}
                  >
                    <div className="relative">
                      <img
                        className="h-14 w-14 rounded-full object-cover border-2 border-white/20"
                        src={user.photoURL || ""}
                        alt={user.displayName}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1">
                        <FiUser className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.displayName || "Anonymous"}
                      </h4>
                      <p className="text-sm text-indigo-500 dark:text-indigo-400">
                        Skill Exchange Partner
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FiMessageSquare className="inline mr-2" />
                        Message (Optional)
                      </label>
                      <textarea
                        rows={3}
                        className={`mt-1 block w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                          theme.mode === "dark"
                            ? "bg-gray-700/50 border-gray-600 text-white"
                            : "bg-white/80 border-gray-200 text-gray-900"
                        } border`}
                        placeholder={`Hi ${user.displayName || "there"}, I'd like to exchange...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <FiCalendar className="inline mr-2" />
                          Date
                        </label>
                        <input
                          type="date"
                          className={`block w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            theme.mode === "dark"
                              ? "bg-gray-700/50 border-gray-600 text-white"
                              : "bg-white/80 border-gray-200 text-gray-900"
                          } border`}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <FiClock className="inline mr-2" />
                          Time
                        </label>
                        <input
                          type="time"
                          className={`block w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            theme.mode === "dark"
                              ? "bg-gray-700/50 border-gray-600 text-white"
                              : "bg-white/80 border-gray-200 text-gray-900"
                          } border`}
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (minutes)
                      </label>
                      <select
                        className={`block w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                          theme.mode === "dark"
                            ? "bg-gray-700/50 border-gray-600 text-white"
                            : "bg-white/80 border-gray-200 text-gray-900"
                        } border`}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                      >
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>

                    <div
                      className={`flex items-center text-sm text-indigo-600 dark:text-indigo-400 p-3 rounded-lg ${theme.mode === "dark" ? "bg-indigo-900/30" : "bg-indigo-50"}`}
                    >
                      <FiVideo className="mr-2 flex-shrink-0" />
                      <span>
                        A secure video meeting link will be generated
                        automatically
                      </span>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          theme.mode === "dark"
                            ? "bg-gray-700/50 text-gray-200 hover:bg-gray-700"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        } shadow-sm`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                      >
                        {isSubmitting ? "Scheduling..." : "Schedule Exchange"}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ExchangeRequestModal;
