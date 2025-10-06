import React from "react";
import { Users, Search, Plus, Hash, UserPlus, X } from "lucide-react";

const API_URL = "http://localhost:5000";

const PublicChatSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  chatGroups,
  activeGroup,
  setActiveGroup,
  onlineUsers,
  searchQuery,
  setSearchQuery,
  setShowCreateGroup,
  currentGroup,
  styles,
  onJoinGroup,
  userId,
  isMainSidebarOpen,
  isAuthenticated,
}) => {
  return (
    <div
      className={`${
        isSidebarOpen ? "w-56" : "w-0"
      } transition-all duration-300 bg-white border-r border-gray-200 shadow-lg flex flex-col overflow-hidden fixed ${
        isMainSidebarOpen ? "left-[260px]" : "left-0"
      } top-0 h-full z-[1002]`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white ${styles.animateFadeIn}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              {typeof currentGroup?.icon === "string" ? (
                <span className="text-sm">{currentGroup.icon}</span>
              ) : (
                <Hash className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold">
                {currentGroup?.name || "Chat"}
              </h2>
              <p className="text-purple-100 text-xs">Public Groups</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateGroup(true)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200"
                title="Create New Group"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 lg:hidden"
              title="Close Sidebar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-purple-200" />
          <input
            type="text"
            placeholder="Search groups or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Chat Groups */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Chat Groups
          </h3>
          <div className="space-y-1">
            {chatGroups.map((group, index) => (
              <div
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={`${
                  styles.userListItem
                } flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeGroup === group.id
                    ? "bg-purple-100 border-l-4 border-purple-500"
                    : "hover:bg-gray-50"
                } ${styles.animateSlideInLeft}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {typeof group.icon === "string" ? (
                    <span className="text-xs">{group.icon}</span>
                  ) : (
                    <Hash className="w-3 h-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700 truncate block">
                    {group.name}
                  </span>
                  <p className="text-sm text-gray-500 truncate">
                    {group.description || "No description"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Users List */}
        {/* <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Online ({onlineUsers.filter((u) => u.isOnline).length})
          </h3>
          <div className="space-y-2">
            {onlineUsers
              .filter((user) => user.isOnline)
              .map((user, index) => (
                <div
                  key={user.id}
                  className={`${styles.userListItem} flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${styles.animateSlideInLeft}`}
                  style={{
                    animationDelay: `${(index + chatGroups.length) * 0.1}s`,
                  }}
                >
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
              ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PublicChatSidebar;
