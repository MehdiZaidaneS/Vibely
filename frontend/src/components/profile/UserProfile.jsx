import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Users, Heart, MessageCircle, UserX } from "lucide-react";

const API_URL = "http://localhost:5000";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("user");
  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    fetchUserProfile();
    if (!isOwnProfile) {
      fetchCurrentUser();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${currentUserId}`);
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  const isFriend = currentUser?.friends?.some(friendId => friendId === userId);

  const handleSendMessage = async () => {
    try {
      // Create or get existing chatroom
      const response = await fetch(`${API_URL}/api/chatrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participants: [currentUserId, userId],
          isGroup: false,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create chatroom");
      }
      const chatroom = await response.json();
      navigate(`/private-chat/${chatroom._id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const handleRemoveFriend = async () => {
    if (!window.confirm(`Are you sure you want to remove ${user.name} as a friend? This will also delete your chat history with them.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/remove/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Dispatch event to refresh conversations in sidebar
        if (data.deletedChatRoom) {
          window.dispatchEvent(new CustomEvent('chatDeleted', { detail: { chatroomId: data.deletedChatRoom } }));
        }

        // Refresh current user data
        await fetchCurrentUser();

        alert("Friend removed successfully");
        navigate(-1);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to remove friend");
      }
    } catch (err) {
      console.error("Failed to remove friend:", err);
      alert("Error removing friend. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:text-purple-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cover/Header Section */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600"></div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-4">
                <div className="border-4 border-white rounded-full shadow-lg">
                  <img
                    src={user.profile_pic}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  {user.username && (
                    <p className="text-gray-500">@{user.username}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwnProfile && isFriend && (
                <div className="mt-4 md:mt-0 pb-2 flex flex-col space-y-2">
                  <button
                    onClick={handleSendMessage}
                    className="flex items-center justify-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  <button
                    onClick={handleRemoveFriend}
                    className="flex items-center justify-center space-x-2 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Remove Friend</span>
                  </button>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {user.friends && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>{user.friends.length} Friends</span>
                </div>
              )}
              {user.createdAt && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-purple-600" />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Joined Events */}
            {user.joinedEvents && user.joinedEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Events ({user.joinedEvents.length})
                </h2>
                <p className="text-gray-500">Member of {user.joinedEvents.length} events</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
