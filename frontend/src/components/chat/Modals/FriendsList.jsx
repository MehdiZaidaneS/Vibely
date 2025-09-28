import React from "react";
import { Users } from "lucide-react";

const FriendsList = ({
  friends,
  searchQuery,
  setActiveConversation,
  setShowFriendsModal,
  styles,
}) => {
  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        Your Friends ({filteredFriends.length})
      </h4>

      {filteredFriends.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {searchQuery
              ? `No friends found matching "${searchQuery}"`
              : "No friends yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFriends.map((friend, index) => (
            <div
              key={friend.id}
              className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${styles.animateSlideInLeft}`}
              style={{ animationDelay: `${index * 0.1}s` }}
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
                  <h5 className="font-medium text-gray-900">{friend.name}</h5>
                  <p className="text-sm text-purple-600">{friend.username}</p>
                  <p className="text-xs text-gray-500">
                    {friend.mutualFriends} mutual friends
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setActiveConversation(friend.id);
                    setShowFriendsModal(false);
                  }}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Message
                </button>
                <button
                  onClick={() => console.log("Remove friend", friend.id)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
