import React, { useState } from "react";
import { Plus, X, Search, Users } from "lucide-react";

const NewConversationModal = ({
  showNewConversation,
  setShowNewConversation,
  allUsers,
  conversations,
  handleStartConversation,
  handleSendFriendRequest,
  handleAcceptFriendRequest,
  handleDeclineFriendRequest,
  friendRequestStates,
  setActiveConversation,
  styles,
}) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");

  if (!showNewConversation) return null;

  const filteredUsers = allUsers.filter((user) => {
    const searchLower = userSearchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
  });

  const renderActionButton = (user) => {
    const hasExistingConversation = conversations.find(
      (conv) => conv.id === user.id
    );
    const currentFriendState =
      friendRequestStates[user.id] || user.friendshipStatus;

    switch (currentFriendState) {
      case "friends":
        return hasExistingConversation ? (
          <button
            onClick={() => {
              setActiveConversation(user.id);
              setShowNewConversation(false);
              setUserSearchQuery("");
            }}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            Open Chat
          </button>
        ) : (
          <button
            onClick={() => handleStartConversation(user.id)}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Chat
          </button>
        );

      case "pending_sent":
      case "pending":
        return (
          <button
            disabled
            className="px-3 py-1 bg-gray-400 text-white text-sm rounded-lg cursor-not-allowed"
          >
            Request Sent
          </button>
        );

      case "pending_received":
        return (
          <div className="flex space-x-1">
            <button
              onClick={() => handleAcceptFriendRequest(user.id)}
              className="px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleDeclineFriendRequest(user.id)}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
            >
              Decline
            </button>
          </div>
        );

      default:
        return (
          <button
            onClick={() => handleSendFriendRequest(user.id)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Friend
          </button>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col ${styles.animateBounceIn}`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                New Conversation
              </h3>
              <p className="text-sm text-gray-500">
                Search for users to start chatting
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowNewConversation(false);
              setUserSearchQuery("");
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4">
          {userSearchQuery === "" ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Start typing to search for users
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No users found matching "{userSearchQuery}"
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user, index) => {
                const currentFriendState =
                  friendRequestStates[user.id] || user.friendshipStatus;

                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${styles.animateSlideInLeft}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {user.isOnline && (
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                          />
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          {user.name}
                        </h5>
                        <p className="text-sm text-purple-600">
                          {user.username}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-gray-500">
                            {user.mutualFriends} mutual friends
                          </p>
                          {currentFriendState === "friends" && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Friends
                            </span>
                          )}
                          {currentFriendState === "pending_received" && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Wants to connect
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {renderActionButton(user)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
