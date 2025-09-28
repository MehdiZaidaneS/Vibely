import React from "react";
import TypingIndicator from "./TypingIndicator";

const ConversationItem = ({
  conversation,
  index,
  isActive,
  onClick,
  styles,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${
        styles.userListItem
      } flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-purple-100 border-l-4 border-purple-500"
          : "hover:bg-gray-50"
      } ${styles.animateSlideInLeft}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Avatar with status indicators */}
      <div className="relative">
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {conversation.isOnline && (
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
          />
        )}
        {conversation.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {conversation.unreadCount}
          </div>
        )}
      </div>

      {/* Conversation details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 truncate">
            {conversation.name}
          </span>
          <span className="text-xs text-gray-500">
            {conversation.timestamp}
          </span>
        </div>
        <div className="flex items-center">
          <p
            className={`text-xs truncate ${
              conversation.unreadCount > 0
                ? "text-gray-900 font-medium"
                : "text-gray-500"
            }`}
          >
            {conversation.isTyping ? "Typing..." : conversation.lastMessage}
          </p>
          {conversation.isTyping && <TypingIndicator styles={styles} />}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
