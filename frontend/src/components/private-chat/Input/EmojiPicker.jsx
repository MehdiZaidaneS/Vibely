import React from "react";
import { Smile } from "lucide-react";

const EmojiPicker = ({
  showEmojiPicker,
  setShowEmojiPicker,
  emojiCategories,
  handleEmojiSelect,
  styles,
}) => {
  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 dropdown-container">
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <Smile className="w-5 h-5" />
      </button>

      {showEmojiPicker && (
        <div
          className={`absolute bottom-12 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${styles.animateFadeIn}`}
        >
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Choose an emoji
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <div key={category}>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">
                    {category}
                  </h4>
                  <div className="grid grid-cols-8 gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors duration-200"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
