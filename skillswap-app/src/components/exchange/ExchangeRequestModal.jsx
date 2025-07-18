import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FiX,
  FiClock,
  FiCalendar,
  FiMessageSquare,
  FiVideo,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const ExchangeRequestModal = ({ user, onClose, currentUser, onSubmit }) => {
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
    if (!message || !date || !time) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName || "Anonymous",
        requesterPhoto: currentUser.photoURL || "",
        recipientId: user.uid,
        recipientName: user.displayName || "Anonymous",
        recipientPhoto: user.photoURL || "",
        message,
        date,
        time,
        duration: parseInt(duration),
        skillToTeach:
          currentUser.skillsToTeach?.find((skill) =>
            user.skillsToLearn?.includes(skill)
          ) || "",
        skillToLearn:
          user.skillsToTeach?.find((skill) =>
            currentUser.skillsToLearn?.includes(skill)
          ) || "",
      });
    } catch (error) {
      toast.error("Failed to send request");
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                    Request Skill Exchange
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={user.photoURL || ""}
                      alt={user.displayName}
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.displayName || "Anonymous"}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.skillsToTeach?.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={`Hi ${user.displayName || "there"}, I'd like to exchange...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCalendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiClock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="time"
                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Duration (minutes)
                      </label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      >
                        <option value="30">30</option>
                        <option value="45">45</option>
                        <option value="60">60</option>
                        <option value="90">90</option>
                        <option value="120">120</option>
                      </select>
                    </div>

                    <div className="flex items-center text-sm text-indigo-600">
                      <FiVideo className="mr-2" />
                      <span>
                        A video meeting link will be generated automatically
                      </span>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isSubmitting ? "Sending..." : "Send Request"}
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
