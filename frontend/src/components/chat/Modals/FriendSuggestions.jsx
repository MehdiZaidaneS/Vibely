import React from "react";
import { Users } from "lucide-react";

const FriendSuggestions = ({
  suggestions,
  handleSendFriendRequest,
  styles,
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        People You May Know ({suggestions.length})
      </h4>

      {suggestions.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No friend suggestions available
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200 ${styles.animateSlideInLeft}`}
              style={{ animationDelay: `${index * 0.1}s` }}
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
                  <p className="text-sm text-purple-600">
                    {suggestion.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {suggestion.mutualFriends} mutual friends
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleSendFriendRequest(suggestion.id)}
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
        </div>
      )}
    </div>
  );
};

export default FriendSuggestions;
