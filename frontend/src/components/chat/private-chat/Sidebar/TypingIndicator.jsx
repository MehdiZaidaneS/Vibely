import React from "react";

const TypingIndicator = ({ styles, size = "small" }) => {
  const dotSize = size === "large" ? "w-2 h-2" : "w-1 h-1";
  const dotColor = size === "large" ? "bg-white" : "bg-purple-500";

  return (
    <div className="ml-2 flex space-x-1">
      <div
        className={`${dotSize} ${dotColor} rounded-full ${styles.animateTyping}`}
        style={{ animationDelay: "0s" }}
      />
      <div
        className={`${dotSize} ${dotColor} rounded-full ${styles.animateTyping}`}
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className={`${dotSize} ${dotColor} rounded-full ${styles.animateTyping}`}
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
};

export default TypingIndicator;
