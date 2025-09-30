import React from "react";
import {
  Users,
  Hash,
  Home,
  MessageCircle,
  UserPlus,
  MoreVertical,
} from "lucide-react";

const PublicChatHeader = ({
  currentGroup,
  isSidebarOpen,
  setIsSidebarOpen,
  onlineUsers,
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
        <div className="flex items-center space-x-4">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
            >
              <Users className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
              {typeof currentGroup?.icon === "string" ? (
                <span className="text-lg">{currentGroup.icon}</span>
              ) : (
                <Hash className="w-5 h-5" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentGroup?.name || "Chat"}
              </h1>
              <p className="text-sm text-gray-500">
                {currentGroup?.members} members •{" "}
                {onlineUsers.filter((u) => u.isOnline).length} online
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate && navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Main Page"
          >
            <Home className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => navigate && navigate("/private-chat")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Private Chat"
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => setShowFriendsModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Friends & People"
          >
            <UserPlus className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative dropdown-container">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {showMoreMenu && (
              <div
                className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${styles.animateFadeIn}`}
              >
                <div className="py-2">
                  {moreOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        option.action();
                        setShowMoreMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${
                        option.danger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicChatHeader;
