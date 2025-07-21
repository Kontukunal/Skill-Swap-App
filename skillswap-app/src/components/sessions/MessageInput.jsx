import React, { useState, useRef } from "react";
import { FiPaperclip, FiSend, FiMic, FiSmile } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const MessageInput = ({ onSendMessage, onSendResource }) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      onSendResource({
        url: fileUrl,
        title: file.name,
        type: file.type,
      });
    }
  };

  return (
    <div
      className={`border-t ${theme.mode === "dark" ? "border-gray-700 bg-gray-800/80" : "border-gray-200 bg-white/80"} p-4 backdrop-blur-lg`}
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => fileInputRef.current.click()}
          className={`p-2 rounded-full ${theme.mode === "dark" ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
        >
          <FiPaperclip />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </motion.button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 rounded-full px-4 py-2 focus:outline-none ${theme.mode === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"} border focus:ring-2 focus:ring-indigo-500`}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg"
        >
          <FiSend />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;
