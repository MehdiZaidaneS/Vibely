import React from "react";
import { Users } from "lucide-react";

const SentRequests = ({ sentRequests, styles }) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        Sent Requests ({sentRequests.length})
      </h4>

      {sentRequests.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No sent friend requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sentRequests.map((request, index) => (
            <div
              key={request.id}
              className={`flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 ${styles.animateSlideInLeft}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h5 className="font-medium text-gray-900">{request.name}</h5>
                  <p className="text-sm text-purple-600">{request.username}</p>
                  <p className="text-xs text-gray-500">
                    {request.mutualFriends} mutual friends
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  disabled
                  className="px-3 py-1 bg-gray-400 text-white text-sm rounded-lg cursor-not-allowed"
                >
                  Pending
                </button>
                <button
                  onClick={() => console.log("Cancel request", request.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentRequests;
