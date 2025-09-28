import React from "react";
import TypingIndicator from "../sidebar/TypingIndicator";

const UserTypingIndicator = ({ styles }) => {
  return (
    <div className={`flex justify-end ${styles.animateFadeIn}`}>
      <div className="flex items-end space-x-2 max-w-xs flex-row-reverse space-x-reverse">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-4 py-3">
          <TypingIndicator styles={styles} size="large" />
        </div>
      </div>
    </div>
  );
};

export default UserTypingIndicator;
