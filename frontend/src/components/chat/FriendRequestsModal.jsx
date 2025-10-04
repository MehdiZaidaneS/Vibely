import React, { useState, useEffect } from "react";
import { UserCheck, UserX, X, Users, Inbox } from "lucide-react";
import {
  getFriendRequests,
  acceptFriendResquest,
  declineFriendRequest,
} from "../../api/userApi"; 

const FriendRequestsModal = ({ isOpen, onClose, onUpdate }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchFriendRequests();
    }
  }, [isOpen]);

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const data = await getFriendRequests();
      // backend returns user objects inside `data` already
      setFriendRequests(data || []);
    } catch (err) {
      console.error("Failed to fetch friend requests:", err);
      setFriendRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      await acceptFriendResquest(requesterId);
      setFriendRequests((prev) =>
        prev.filter((req) => req._id !== requesterId)
      );
      if (onUpdate) onUpdate();

      // notify sidebar (conversations refresh)
      window.dispatchEvent(
        new CustomEvent("friendAdded", { detail: { friendId: requesterId } })
      );
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    }
  };

  const handleReject = async (requesterId) => {
    try {
      await declineFriendRequest(requesterId);
      setFriendRequests((prev) =>
        prev.filter((req) => req._id !== requesterId)
      );
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to reject friend request:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Friend Requests
              </h2>
              {friendRequests.length > 0 && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  {friendRequests.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading requests...</p>
            </div>
          ) : friendRequests.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No friend requests</p>
              <p className="text-gray-400 text-sm mt-2">
                When someone sends you a friend request, it will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {friendRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {request.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {request.email}
                        </p>
                        {request.interests?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {request.interests.slice(0, 3).map((interest, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                            {request.interests.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{request.interests.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Accept"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">Accept</span>
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Reject"
                      >
                        <UserX className="w-4 h-4" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequestsModal;
