import React from "react";
import { Home, Hash, UserPlus } from "lucide-react";
import MoreOptionsDropdown from "./MoreOptionsDropdown";

const ChatHeader = ({
  currentConversation,
  isSidebarOpen,
  navigate,
  setShowFriendsModal,
  showMoreMenu,
  setShowMoreMenu,
  moreOptions,
  styles,
}) => {
  return (
    <div
      className={`bg-white border-b border-gray-200 p-4 shadow-sm fixed top-0 right-0 ${
        isSidebarOpen ? "left-80" : "left-0"
      } transition-all duration-300 z-30 ${styles.animateFadeIn}`}
    >
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={currentConversation?.avatar}
              alt={currentConversation?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {currentConversation?.isOnline && (
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
              />
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentConversation?.name}
            </h1>
            <p className="text-sm text-gray-500">
              {currentConversation?.isOnline ? "Online" : "Last seen recently"}
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Main Page"
          >
            <Home className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => navigate("/public-chat")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Public Chat"
          >
            <Hash className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => setShowFriendsModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Friends"
          >
            <UserPlus className="w-5 h-5 text-gray-600" />
          </button>

          <MoreOptionsDropdown
            showMoreMenu={showMoreMenu}
            setShowMoreMenu={setShowMoreMenu}
            moreOptions={moreOptions}
            styles={styles}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
