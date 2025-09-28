import React from "react";
import ConversationItem from "./ConversationItem";

const ConversationList = ({
  conversations,
  activeConversation,
  setActiveConversation,
  styles,
}) => {
  return (
    <div className="space-y-1">
      {conversations.map((conversation, index) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          index={index}
          isActive={activeConversation === conversation.id}
          onClick={() => setActiveConversation(conversation.id)}
          styles={styles}
        />
      ))}
    </div>
  );
};

export default ConversationList;
