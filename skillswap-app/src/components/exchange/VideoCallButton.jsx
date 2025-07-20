import React from "react";
import { FiVideo, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";

const VideoCallButton = ({ session }) => {
  const startVideoCall = () => {
    const roomId = `skillswap-${session.id}`;
    window.open(`/video-call?room=${roomId}`, "_blank");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={startVideoCall}
      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
    >
      <FiVideo className="h-5 w-5" />
      <span>Start Video Call</span>
      <FiExternalLink className="h-4 w-4" />
    </motion.button>
  );
};

export default VideoCallButton;
