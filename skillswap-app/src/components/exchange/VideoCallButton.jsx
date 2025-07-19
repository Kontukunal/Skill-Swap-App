import React from "react";
import { FiVideo } from "react-icons/fi";

const VideoCallButton = ({ session }) => {
  const startVideoCall = () => {
    // In a real app, this would connect to your video call service
    // For demo purposes, we'll just open a new window
    const roomId = `skillswap-${session.id}`;
    window.open(`/video-call?room=${roomId}`, "_blank");
  };

  return (
    <button
      onClick={startVideoCall}
      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <FiVideo className="mr-1.5 h-4 w-4" />
      Start Video Call
    </button>
  );
};

export default VideoCallButton;
