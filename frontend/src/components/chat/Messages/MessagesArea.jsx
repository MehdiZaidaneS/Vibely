import React from "react";
import MessageBubble from "./MessageBubble";
import UserTypingIndicator from "./UserTypingIndicator";

const MessagesArea = ({
  messages,
  currentConversation,
  isTyping,
  messagesEndRef,
  styles,
}) => {
  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 pt-20 ${styles.scrollableChat}`}
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          index={index}
          currentConversation={currentConversation}
          styles={styles}
        />
      ))}

      {isTyping && <UserTypingIndicator styles={styles} />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesArea;
