import React from "react";

const MessageBubble = ({
  message,
  index,
  currentConversation,
  otherParticipant,
  userId,
  styles,
}) => {
  // Determine if this message is from the current user
  const isCurrentUser = message.sender._id?.toString() === userId;

  return (
    <div
      className={`${styles.messageContainer} ${styles.animateMessageSlideIn} ${
        isCurrentUser
          ? `flex justify-end ${styles.animateSlideInRight}`
          : `flex justify-start ${styles.animateSlideInLeft}`
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
          isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar for non-current user messages */}
        {!isCurrentUser && (
          <div className="relative flex-shrink-0">
            <img
              src={otherParticipant?.avatar || "/default-avatar.png"}
              alt={otherParticipant?.name || "Unknown User"}
              className="w-8 h-8 rounded-full object-cover"
            />
            {otherParticipant?.isOnline && (
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
              />
            )}
          </div>
        )}

        {/* Message content */}
        <div
          className={`${styles.floatingElement} ${
            isCurrentUser
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              : "bg-white border border-gray-200 text-gray-900"
          } rounded-lg px-4 py-3 shadow-sm`}
        >
          {/* Image content (if message has image) */}
          {message.image && (
            <div className="mb-2">
              <img
                src={message.image}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.image, "_blank")}
              />
            </div>
          )}

          {/* Text content - handle both backend (content) and frontend (message) properties */}
          {(message.content || message.message) && (
            <p className="text-sm whitespace-pre-wrap">
              {message.content || message.message}
            </p>
          )}

          {/* Timestamp */}
          <p
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-purple-100" : "text-gray-500"
            }`}
          >
            {message.timestamp ||
              (message.createdAt
                ? new Date(message.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "now")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
