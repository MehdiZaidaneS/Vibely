import React, { useState } from "react";
import {
  Users,
  Hash,
  Home,
  MessageCircle,
  UserPlus,
  Bell,
  X,
} from "lucide-react";

const PublicChatHeader = ({
  currentGroup,
  isSidebarOpen,
  setIsSidebarOpen,
  onlineUsers,
  navigate,
  setShowFriendsModal,
  styles,
  isMainSidebarOpen,
}) => {
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  const leftOffset = isMainSidebarOpen
    ? (isSidebarOpen ? "left-[580px]" : "left-[260px]")
    : (isSidebarOpen ? "left-80" : "left-0");

  return (
    <>
      <div
        className={`bg-white border-b border-gray-200 p-4 shadow-sm fixed top-0 right-0 ${leftOffset} transition-all duration-300 z-30 ${styles.animateFadeIn}`}
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
            <div
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowGroupInfo(true)}
            >
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
            onClick={() => console.log("Notifications")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => setShowFriendsModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Friends & People"
          >
            <UserPlus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>

      {/* Group Info Modal */}
      {showGroupInfo && currentGroup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowGroupInfo(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Group Info</h2>
              <button
                onClick={() => setShowGroupInfo(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                {typeof currentGroup?.icon === "string" ? (
                  <span className="text-2xl">{currentGroup.icon}</span>
                ) : (
                  <Hash className="w-8 h-8" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentGroup.name}
                </h3>
                <p className="text-sm text-gray-500">Public Group</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-sm text-gray-600">
                {currentGroup.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicChatHeader;
