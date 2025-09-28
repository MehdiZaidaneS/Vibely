import React from "react";
import { Paperclip, Image } from "lucide-react";

const AttachmentButton = ({
  showImageUpload,
  setShowImageUpload,
  handleImageUpload,
  fileInputRef,
  styles,
}) => {
  return (
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
  );
};

export default AttachmentButton;
