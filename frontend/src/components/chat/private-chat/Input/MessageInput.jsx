import React from "react";
import { Send } from "lucide-react";
import AttachmentButton from "./AttachmentButton";
import EmojiPicker from "./EmojiPicker";

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyPress,
  currentConversation,
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
}) => {
  return (
    <div
      className={`bg-white border-t border-gray-200 p-4 ${styles.animateSlideUp}`}
    >
      <div className="flex items-end space-x-4">
        <AttachmentButton
          showImageUpload={showImageUpload}
          setShowImageUpload={setShowImageUpload}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          styles={styles}
        />

        <div className="flex-1 relative">
          <textarea
            ref={messageInputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${currentConversation?.name || ""}...`}
            rows="1"
            className={`${styles.messageInput} w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />

          <EmojiPicker
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            emojiCategories={emojiCategories}
            handleEmojiSelect={handleEmojiSelect}
            styles={styles}
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={newMessage.trim() === ""}
          className={`${styles.sendButton} p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
