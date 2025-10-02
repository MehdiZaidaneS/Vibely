import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, UserCheck, UserX, Search, X } from "lucide-react";
import Avatar from "../common/Avatar";

const API_URL = "http://localhost:5000";

const PeopleModal = ({ isOpen, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("user");

  useEffect(() => {
    if (isOpen) {
      fetchCurrentUser();
      fetchAllUsers();
    }
  }, [isOpen]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`);
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      }
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const allUsers = await response.json();
      // Filter out current user
      const otherUsers = allUsers.filter(user => user._id !== userId);
      setUsers(otherUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (targetUserId) => {
    console.log("=== FRONTEND DEBUG ===");
    console.log("Token:", token);
    console.log("UserId:", userId);
    console.log("Target User:", targetUserId);

    if (!token) {
      alert("You are not logged in. Please log in and try again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${targetUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Update UI to show request sent
        setUsers(users.map(user =>
          user._id === targetUserId
            ? { ...user, requestSent: true }
            : user
        ));
        // Notify parent to refresh
        if (onUpdate) onUpdate();
        alert("Friend request sent!");
      } else {
        alert(data.error || data.message || "Failed to send friend request");
      }
    } catch (err) {
      console.error("Failed to send friend request:", err);
      alert("Error sending friend request. Please try again.");
    }
  };

  const removeFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend? This will also delete your chat history with them.")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/remove/${friendId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Remove friend response:", data);

        // Refresh user data
        await fetchCurrentUser();
        if (onUpdate) onUpdate();

        // If we're on the deleted chat page, navigate away
        if (data.deletedChatRoom) {
          console.log("Dispatching chatDeleted event for chatroom:", data.deletedChatRoom);
          window.dispatchEvent(new CustomEvent('chatDeleted', { detail: { chatroomId: data.deletedChatRoom } }));
        }

        alert("Friend removed and chat deleted");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to remove friend");
      }
    } catch (err) {
      console.error("Failed to remove friend:", err);
      alert("Error removing friend. Please try again.");
    }
  };

  const isFriend = (user) => {
    return currentUser?.friends?.some(friendId => friendId === user._id);
  };

  const hasSentRequest = (user) => {
    return user.friend_requests?.some(requestId => requestId === userId);
  };

  const hasReceivedRequest = (user) => {
    return currentUser?.friend_requests?.some(requestId => requestId === user._id);
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Find People</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  {/* User Info */}
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar
                      user={user}
                      size="lg"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        onClose();
                        navigate(`/profile/${user._id}`);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-gray-900 truncate cursor-pointer hover:text-purple-600"
                        onClick={() => {
                          onClose();
                          navigate(`/profile/${user._id}`);
                        }}
                      >
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      {user.interests && user.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.interests.slice(0, 2).map((interest, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                            >
                              {interest}
                            </span>
                          ))}
                          {user.interests.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{user.interests.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {isFriend(user) ? (
                    <button
                      onClick={() => removeFriend(user._id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Remove Friend</span>
                    </button>
                  ) : hasReceivedRequest(user) ? (
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/notifications');
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Accept Request</span>
                    </button>
                  ) : hasSentRequest(user) || user.requestSent ? (
                    <button
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-default text-sm"
                      disabled
                    >
                      <UserX className="w-4 h-4" />
                      <span>Request Sent</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(user._id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Friend</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleModal;
