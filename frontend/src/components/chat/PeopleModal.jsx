import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, UserCheck, UserX, Search, X, MessageCircle } from "lucide-react";
import {
  getAllUsers,
  getUserbyId,
  sendFriendRequest,
  getFriends,
} from "../../api/userApi";

const API_URL = "http://localhost:5000";

const PeopleModal = ({ isOpen, onClose, onUpdate, setIsFriendRequestsModalOpen }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "friends"

  useEffect(() => {
    if (isOpen) {
      fetchCurrentUser();
      fetchAllUsers();
      fetchFriends();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      const friendsList = await getFriends();
      setFriends(friendsList || []);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
      setFriends([]);
    }
  };

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const user = await getUserbyId(); // returns the user document
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (targetUserId) => {
    try {
      await sendFriendRequest(targetUserId);
      // Optimistically remove or mark as requested:
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUserId ? { ...u, friendRequestPending: "Pending" } : u
        )
      );

      if (onUpdate) onUpdate(); // Let parent refresh
    } catch (err) {
      console.error("Failed to send friend request:", err);
      alert("Error sending friend request. Please try again.");
    }
  };

  const handleStartChat = async (user) => {
    const currentUserId = localStorage.getItem("userId");
    try {
      // Create or get existing chatroom
      const response = await fetch(`${API_URL}/api/chatrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participants: [currentUserId, user._id],
          isGroup: false,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create chatroom");
      }
      const chatroom = await response.json();
      onClose();
      navigate(`/private-chat/${chatroom._id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      alert("Error starting chat. Please try again.");
    }
  };

  // Helpers: prefer using server-sent flags if available
  const isFriend = (user) => {
    if (!currentUser) return false;
    // server may return friends as populated docs or ID strings
    return (
      (currentUser.friends || []).some(
        (f) => (f._id ? f._id.toString() : f.toString()) === user._id.toString()
      ) ||
      false
    );
  };

  const hasSentRequest = (user) => {
    // server may already include friendRequestPending on the user object
    if (user.friendRequestPending && user.friendRequestPending === "Pending")
      return true;

    // fallback: check target user's friend_requests array for a request from current user
    if (user.friend_requests && currentUser) {
      return user.friend_requests.some(
        (req) =>
          (req.user && (req.user._id ? req.user._id.toString() : req.user.toString())) ===
          currentUser._id.toString()
      );
    }
    return false;
  };

  const hasReceivedRequest = (user) => {
    // server might include friendRequestReceived flag
    if (user.friendRequestReceived && user.friendRequestReceived === "Respond")
      return true;

    // fallback: check currentUser.friend_requests for a request from this user
    if (currentUser && currentUser.friend_requests) {
      return currentUser.friend_requests.some(
        (req) =>
          (req.user && (req.user._id ? req.user._id.toString() : req.user.toString())) ===
          user._id.toString()
      );
    }
    return false;
  };

  // Determine which list to use based on active tab
  const sourceUsers = activeTab === "friends" ? friends : users;

  const filteredUsers = sourceUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedUsers = filteredUsers;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">People</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All People
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "friends"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Friends ({friends.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "friends" ? "Search friends..." : "Search by name, username or email..."}
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
          ) : displayedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {activeTab === "friends" ? "No friends found" : "No users found"}
              </p>
              {activeTab === "friends" && (
                <p className="text-gray-400 text-sm mt-2">
                  Add friends to start chatting with them
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  {/* User Info */}
                  <div className="flex items-start space-x-4 mb-4">
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

                  {/* Action Buttons */}
                  {activeTab === "friends" || isFriend(user) ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStartChat(user)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/profile/${user._id}`);
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <UserX className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                    </div>
                  ) : hasReceivedRequest(user) ? (
                    <button
                      onClick={() => {
                        onClose();
                        setIsFriendRequestsModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Respond</span>
                    </button>
                  ) : hasSentRequest(user) ? (
                    <button
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg cursor-default text-sm"
                      disabled
                    >
                      <UserX className="w-4 h-4" />
                      <span>Request Sent</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendFriendRequest(user._id)}
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
