import React from "react";
import { format } from "date-fns";
import { FiVideo, FiLink, FiFile } from "react-icons/fi";

const MessageList = ({ messages, currentUserId, session }) => {
  // Helper to check if session is active
  const isSessionTimeValid = () => {
    if (!session?.date || !session?.time || !session?.duration) return false;
    try {
      const sessionDateTime = new Date(`${session.date}T${session.time}`);
      const now = new Date();
      const tenMinutesBefore = new Date(sessionDateTime.getTime() - 10 * 60000);
      const thirtyMinutesAfter = new Date(
        sessionDateTime.getTime() + (parseInt(session.duration) + 30) * 60000
      );
      return now >= tenMinutesBefore && now <= thirtyMinutesAfter;
    } catch {
      return false;
    }
  };

  // Safely format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      return timestamp?.toDate
        ? format(timestamp.toDate(), "h:mm a")
        : "Just now";
    } catch {
      return "Just now";
    }
  };

  // Render message content based on type
  const renderMessageContent = (message) => {
    // Safely extract message properties with defaults
    const {
      type = "text",
      text = "",
      senderName = "Unknown",
      senderId = "",
      meetingLink = null,
      resourceTitle = "",
      resourceUrl = "",
    } = message;

    switch (type) {
      case "system":
        return (
          <>
            <div className="text-center text-sm italic">{text}</div>
            {meetingLink && isSessionTimeValid() && (
              <div className="mt-2 text-center">
                <a
                  href={meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-200 hover:text-white text-sm"
                >
                  <FiVideo className="mr-1" /> Join Meeting
                </a>
              </div>
            )}
          </>
        );

      case "resource":
        return (
          <>
            <div className="font-medium flex items-center">
              <FiFile className="mr-1" /> {resourceTitle || "Untitled Resource"}
            </div>
            {resourceUrl && (
              <a
                href={resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-200 hover:text-white flex items-center mt-1"
              >
                <FiLink className="mr-1" /> View Resource
              </a>
            )}
          </>
        );

      default: // "text" or fallback
        return (
          <>
            <p>{text}</p>
            <p className="text-xs opacity-70 mt-1">
              {senderId === currentUserId ? "You" : senderName} •{" "}
              {formatTimestamp(message.timestamp)}
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                  message.senderId === currentUserId
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {renderMessageContent(message)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
