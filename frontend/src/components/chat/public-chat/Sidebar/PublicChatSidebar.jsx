import React from "react";
import { Users, Search, Plus, Hash } from "lucide-react";

const PublicChatSidebar = ({
  isSidebarOpen,
  chatGroups,
  activeGroup,
  setActiveGroup,
  onlineUsers,
  searchQuery,
  setSearchQuery,
  setShowCreateGroup,
  currentGroup,
  styles,
}) => {
  return (
    <div
      className={`${
        isSidebarOpen ? "w-80" : "w-0"
      } transition-all duration-300 bg-white border-r border-gray-200 shadow-lg flex flex-col overflow-hidden fixed left-0 top-0 h-full z-40`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white ${styles.animateFadeIn}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              {typeof currentGroup?.icon === "string" ? (
                <span className="text-lg">{currentGroup.icon}</span>
              ) : (
                <Hash className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {currentGroup?.name || "Chat"}
              </h2>
              <p className="text-purple-100 text-sm">
                {currentGroup?.members} members
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
            title="Create New Group"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200" />
          <input
            type="text"
            placeholder="Search groups or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat Groups */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Chat Groups
          </h3>
          <div className="space-y-1">
            {chatGroups.map((group, index) => (
              <div
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={`${
                  styles.userListItem
                } flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeGroup === group.id
                    ? "bg-purple-100 border-l-4 border-purple-500"
                    : "hover:bg-gray-50"
                } ${styles.animateSlideInLeft}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold">
                  {typeof group.icon === "string" ? (
                    <span className="text-sm">{group.icon}</span>
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {group.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {group.members}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {group.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Users List */}
        <div className="p-4 border-t border-gray-200">
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
        </div>
      </div>
    </div>
  );
};

export default PublicChatSidebar;
