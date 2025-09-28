import React from "react";
import MessageBubble from "./MessageBubble";
import UserTypingIndicator from "./UserTypingIndicator";

const MessagesArea = ({
  messages,
  currentConversation,
  otherParticipant,
  userId,
  isTyping,
  messagesEndRef,
  styles,
}) => {
  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 pt-20 ${styles.scrollableChat}`}
    >
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageBubble
            key={message._id || index}
            message={message}
            index={index}
            currentConversation={currentConversation}
            otherParticipant={otherParticipant}
            userId={userId}
            styles={styles}
          />
        ))
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-lg">Select a conversation or start a new one.</p>
          </div>
        </div>
      )}

      {isTyping && <UserTypingIndicator styles={styles} />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesArea;
