import React from "react";
import { Send, Paperclip, Image, Smile } from "lucide-react";

const PublicMessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyPress,
  currentGroup,
  messageInputRef,
  showEmojiPicker,
  setShowEmojiPicker,
  showImageUpload,
  setShowImageUpload,
  handleImageUpload,
  fileInputRef,
  emojiCategories,
  handleEmojiSelect,
  styles,
  isAuthenticated,
}) => {
  return (
    <div
      className={`bg-white border-t border-gray-200 p-4 ${styles.animateSlideUp}`}
    >
      {!isAuthenticated ? (
        <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-lg">
          Please <a href="/login" className="text-purple-600 hover:underline font-medium">login</a> to send messages
        </div>
      ) : (
        <div className="flex items-end space-x-4">
          <div className="relative dropdown-container">
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          {showImageUpload && (
            <div
              className={`absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 ${styles.animateFadeIn}`}
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                <Image className="w-4 h-4" />
                <span>Upload Image</span>
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="flex-1 relative">
          <textarea
            ref={messageInputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${currentGroup?.name || "chat"}...`}
            rows="1"
            className={`${styles.messageInput} w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />

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
                    {Object.entries(emojiCategories).map(
                      ([category, emojis]) => (
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
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

          <button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ""}
            className={`${styles.sendButton} p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicMessageInput;
