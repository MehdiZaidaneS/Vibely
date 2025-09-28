import React, { useState } from "react";
import { Users, Search, X, UserPlus } from "lucide-react";

const PublicFriendsModal = ({
  showFriendsModal,
  setShowFriendsModal,
  friends,
  friendRequests,
  suggestedFriends,
  handleAcceptFriend,
  handleDeclineFriend,
  handleSendFriendRequest,
  handleRemoveFriend,
  styles,
}) => {
  const [friendsModalTab, setFriendsModalTab] = useState("friends");

  if (!showFriendsModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col ${styles.animateBounceIn}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Friends</h3>
              <p className="text-sm text-gray-500">Manage your connections</p>
            </div>
          </div>
          <button
            onClick={() => setShowFriendsModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-1/4 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setFriendsModalTab("friends")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  friendsModalTab === "friends"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Friends ({friends.length})
              </button>
              <button
                onClick={() => setFriendsModalTab("requests")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  friendsModalTab === "requests"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Requests ({friendRequests.length})
              </button>
              <button
                onClick={() => setFriendsModalTab("sent")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  friendsModalTab === "sent"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Sent (0)
              </button>
              <button
                onClick={() => setFriendsModalTab("suggestions")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  friendsModalTab === "suggestions"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Suggestions ({suggestedFriends.length})
              </button>
            </nav>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search friends..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {/* Friends Tab */}
                {friendsModalTab === "friends" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Your Friends ({friends.length})
                    </h4>
                    <div className="space-y-3">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {friend.isOnline && (
                                <div
                                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                                />
                              )}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {friend.name}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {friend.status}
                              </p>
                              <p className="text-xs text-gray-500">
                                {friend.mutualFriends} mutual friends
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                console.log("Message", friend.name);
                                setShowFriendsModal(false);
                              }}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Message
                            </button>
                            <button
                              onClick={() => handleRemoveFriend(friend.id)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Friend Requests Tab */}
                {friendsModalTab === "requests" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Friend Requests ({friendRequests.length})
                    </h4>
                    <div className="space-y-3">
                      {friendRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={request.avatar}
                              alt={request.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {request.name}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {request.mutualFriends} mutual friends
                              </p>
                              <p className="text-xs text-gray-400">
                                Sent {request.requestDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptFriend(request.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleDeclineFriend(request.id)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                      {friendRequests.length === 0 && (
                        <div className="text-center py-8">
                          <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">
                            No pending friend requests
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sent Requests Tab */}
                {friendsModalTab === "sent" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Sent Requests (0)
                    </h4>
                    <div className="space-y-3">
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">
                          No sent friend requests
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions Tab */}
                {friendsModalTab === "suggestions" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      People You May Know ({suggestedFriends.length})
                    </h4>
                    <div className="space-y-3">
                      {suggestedFriends.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={suggestion.avatar}
                              alt={suggestion.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {suggestion.name}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {suggestion.reason}
                              </p>
                              <p className="text-xs text-gray-400">
                                {suggestion.mutualFriends} mutual friends
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleSendFriendRequest(suggestion.id)
                              }
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Add Friend
                            </button>
                            <button
                              onClick={() =>
                                console.log("Remove suggestion", suggestion.id)
                              }
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      {suggestedFriends.length === 0 && (
                        <div className="text-center py-8">
                          <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">
                            No friend suggestions available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicFriendsModal;
