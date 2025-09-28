import React from "react";
import { Users, Search, Plus } from "lucide-react";
import ConversationList from "./ConversationList";

const ChatSidebar = ({
  isSidebarOpen,
  conversations,
  searchQuery,
  setSearchQuery,
  activeConversation,
  setActiveConversation,
  setShowNewConversation,
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Messages</h2>
              <p className="text-purple-100 text-sm">
                {conversations?.length || 0} conversations
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              setShowNewConversation && setShowNewConversation(true)
            }
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
            title="New Conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {conversations && conversations.length > 0 ? (
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              setActiveConversation={setActiveConversation}
              styles={styles}
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">
                  Start a new conversation to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
