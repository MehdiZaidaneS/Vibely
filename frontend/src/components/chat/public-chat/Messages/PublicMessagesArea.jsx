import React from "react";

const PublicMessagesArea = ({ messages, isTyping, messagesEndRef, styles }) => {
  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 pt-20 ${styles.scrollableChat}`}
    >
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`${styles.messageContainer} ${
            styles.animateMessageSlideIn
          } ${
            message.isCurrentUser
              ? `flex justify-end ${styles.animateSlideInRight}`
              : `flex justify-start ${styles.animateSlideInLeft}`
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
              message.isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={message.avatar}
                alt={message.user}
                className="w-8 h-8 rounded-full object-cover"
              />
              {message.isOnline && (
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                />
              )}
            </div>

            <div
              className={`${styles.floatingElement} ${
                message.isCurrentUser
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              } rounded-lg px-4 py-3 shadow-sm`}
            >
              {!message.isCurrentUser && (
                <p className="text-xs font-medium text-purple-600 mb-1">
                  {message.user}
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

              {message.message && (
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
              )}

              <p
                className={`text-xs mt-1 ${
                  message.isCurrentUser ? "text-purple-100" : "text-gray-500"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className={`flex justify-end ${styles.animateFadeIn}`}>
          <div className="flex items-end space-x-2 max-w-xs flex-row-reverse space-x-reverse">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div
                  className={`w-2 h-2 bg-white rounded-full ${styles.animateTyping}`}
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className={`w-2 h-2 bg-white rounded-full ${styles.animateTyping}`}
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className={`w-2 h-2 bg-white rounded-full ${styles.animateTyping}`}
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default PublicMessagesArea;
