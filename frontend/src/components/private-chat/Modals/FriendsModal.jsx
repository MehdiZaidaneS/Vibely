import React, { useState } from "react";
import { Users, Search, X } from "lucide-react";
import FriendsList from "./FriendsList";
import FriendRequests from "./FriendRequests";
import SentRequests from "./SentRequests";
import FriendSuggestions from "./FriendSuggestions";

const FriendsModal = ({
  showFriendsModal,
  setShowFriendsModal,
  allUsers,
  handleSendFriendRequest,
  handleAcceptFriendRequest,
  handleDeclineFriendRequest,
  setActiveConversation,
  styles,
}) => {
  const [friendsModalTab, setFriendsModalTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");

  if (!showFriendsModal) return null;

  // Categorize users
  const friends = allUsers.filter(
    (user) => user.friendshipStatus === "friends"
  );
  const pendingRequests = allUsers.filter(
    (user) => user.friendshipStatus === "pending_received"
  );
  const sentRequests = allUsers.filter(
    (user) => user.friendshipStatus === "pending_sent"
  );
  const suggestions = allUsers.filter(
    (user) => user.friendshipStatus === "not_friends"
  );

  const renderTabContent = () => {
    switch (friendsModalTab) {
      case "friends":
        return (
          <FriendsList
            friends={friends}
            searchQuery={searchQuery}
            setActiveConversation={setActiveConversation}
            setShowFriendsModal={setShowFriendsModal}
            styles={styles}
          />
        );
      case "requests":
        return (
          <FriendRequests
            pendingRequests={pendingRequests}
            handleAcceptFriendRequest={handleAcceptFriendRequest}
            handleDeclineFriendRequest={handleDeclineFriendRequest}
            styles={styles}
          />
        );
      case "sent":
        return <SentRequests sentRequests={sentRequests} styles={styles} />;
      case "suggestions":
        return (
          <FriendSuggestions
            suggestions={suggestions}
            handleSendFriendRequest={handleSendFriendRequest}
            styles={styles}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col ${styles.animateBounceIn}`}
      >
        {/* Modal Header */}
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
          {/* Sidebar Navigation */}
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
                Requests ({pendingRequests.length})
              </button>
              <button
                onClick={() => setFriendsModalTab("sent")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  friendsModalTab === "sent"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Sent ({sentRequests.length})
              </button>
              <button
                onClick={() => setFriendsModalTab("suggestions")}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  friendsModalTab === "suggestions"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Suggestions ({suggestions.length})
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
