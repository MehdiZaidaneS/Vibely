import React from "react";
import { useNavigate } from "react-router-dom";

const PublicMessagesArea = ({ messages, isTyping, messagesEndRef, styles, userId, isAuthenticated }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 pt-20 ${styles.scrollableChat}`}
    >
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`${styles.messageContainer} ${message.sender?._id.toString() === userId
              ? `flex justify-end ${styles.animateSlideInRight}`
              : `flex justify-start ${styles.animateSlideInLeft}`
              }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.sender?._id.toString() === userId
                ? "flex-row-reverse space-x-reverse"
                : ""
                }`}
            >
              {/* For public chat, we always show the avatar and name of the sender */}
              <div className="relative flex-shrink-0">
                <img
                  src={message.sender?.profile_pic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                  alt={message.sender?.name || 'Unknown User'}
                  className={`w-8 h-8 rounded-full object-cover ${isAuthenticated ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
                  onClick={() => isAuthenticated && navigate(`/profile/${message.sender._id}`)}
                />
              </div>

              <div
                className={`${styles.floatingElement} ${message.sender?._id.toString() === userId
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
                  } rounded-lg px-4 py-3 shadow-sm`}
              >
                {/* Display sender's name for other users' messages */}
                {message.sender?._id.toString() !== userId && (
                  <p className="text-xs font-medium text-purple-600 mb-1">
                    {message.sender?.name}
                  </p>
                )}

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

                {message.content && (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}

                <p
                  className={`text-xs mt-1 ${message.sender?._id.toString() === userId ? "text-purple-100" : "text-gray-500"
                    }`}
                >
                  {new Date(message.createdAt || Date.now()).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-lg">Select a conversation or start a new one.</p>
          </div>
        </div>
      )}

      {isTyping && (
        <div className={`flex justify-end ${styles.animateFadeIn}`}>
          {/* Typing Indicator */}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default PublicMessagesArea;