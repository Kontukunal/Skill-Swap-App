import React, { useState } from "react";
import { FiCalendar, FiClock, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const SessionScheduleModal = ({ session, onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [date, setDate] = useState(session?.date || "");
  const [time, setTime] = useState(session?.time || "");
  const [duration, setDuration] = useState(session?.duration || "30");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !time || !duration) {
      toast.error("Please fill all fields");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime < now) {
      toast.error("Please select a future date and time");
      return;
    }

    onSubmit({ date, time, duration });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md rounded-2xl shadow-xl ${theme.mode === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Schedule Session
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={`block w-full pl-10 pr-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${theme.mode === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiClock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${theme.mode === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`block w-full pl-3 pr-10 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${theme.mode === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium ${theme.mode === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-50"} border ${theme.mode === "dark" ? "border-gray-600" : "border-gray-300"}`}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-sm text-sm font-medium hover:shadow-md"
            >
              Schedule
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SessionScheduleModal;
