import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Users, Search, ChevronLeft, Home, Hash, UserPlus, Bell } from "lucide-react";
import io from "socket.io-client";
import styles from "./privateChat.module.css";
import PeopleModal from "./PeopleModal";
import FriendRequestsModal from "./FriendRequestsModal";
import Sidebar from "../../import/Sidebar";
import { markAsRead } from "../../api/userApi";

const API_URL = "http://localhost:5000";

const PrivateChat = () => {
  const navigate = useNavigate();
  const { chatroomId } = useParams();
  const socketRef = useRef(null);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentChatroom, setCurrentChatroom] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [isFriendRequestsModalOpen, setIsFriendRequestsModalOpen] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Effect 0: Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setCurrentUserData(user);
          setFriendRequestCount(user.friend_requests?.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    fetchCurrentUser();
  }, [userId]);

  const refreshUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`);
      if (response.ok) {
        const user = await response.json();
        setCurrentUserData(user);
        setFriendRequestCount(user.friend_requests?.length || 0);
      }
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  // Effect 1: Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io(API_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setSocketConnected(true);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setSocketConnected(false);
    });

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Effect 1: Fetch chatrooms and set current chatroom
  useEffect(() => {
    const getChatrooms = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chatrooms/searchPri/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chatrooms");
        }
        const chatrooms = await response.json();
        setConversations(chatrooms);
        if (chatroomId) {
          const room = chatrooms.find(c => c.id === chatroomId);
          if (room) {
            setCurrentChatroom(room);
          } else {
            navigate("/private-chat");
          }
        }
      } catch (err) {
        console.error("Failed to fetch chatrooms:", err);
      }
    };
    getChatrooms();

    // Listen for chat deletion events
    const handleChatDeleted = (event) => {
      console.log("Chat deleted event received:", event.detail);
      const deletedChatroomId = event.detail.chatroomId;
      console.log("Deleted chatroom ID:", deletedChatroomId);
      console.log("Current chatroom ID:", chatroomId);

      // Remove deleted chat from conversations
      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== deletedChatroomId);
        console.log("Conversations before filter:", prev.length);
        console.log("Conversations after filter:", filtered.length);
        return filtered;
      });

      // If currently viewing the deleted chat, navigate away
      if (chatroomId === deletedChatroomId) {
        console.log("Currently viewing deleted chat, navigating away");
        navigate("/private-chat");
      }
    };

    // Listen for friend added events to refresh sidebar
    const handleFriendAdded = () => {
      console.log("Friend added event received, refreshing conversations");
      getChatrooms();
    };

    window.addEventListener('chatDeleted', handleChatDeleted);
    window.addEventListener('friendAdded', handleFriendAdded);

    return () => {
      window.removeEventListener('chatDeleted', handleChatDeleted);
      window.removeEventListener('friendAdded', handleFriendAdded);
    };
  }, [userId, chatroomId, navigate]);

  // Effect 2: Fetch messages for the active chatroom
  useEffect(() => {
    const getMessages = async () => {
      if (!chatroomId) {
        setMessages([]);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/chatrooms/history/${chatroomId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const msgs = await response.json();
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };
    getMessages();
  }, [chatroomId]);

  // Effect 3: Handle real-time WebSocket communication
  useEffect(() => {
    if (!chatroomId || !socketRef.current || !socketConnected) return;

    socketRef.current.emit("joinRoom", chatroomId);

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some(m => m._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
    };

    socketRef.current.on("receiveMessage", handleNewMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage", handleNewMessage);
      }
    };
  }, [chatroomId, socketConnected]);

  // Effect 4: Auto-scroll to the bottom of the message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect 5: Search for friends only
  useEffect(() => {
    const searchForUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${API_URL}/api/users/search?query=${encodeURIComponent(searchQuery)}&userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to search users");
        }
        const users = await response.json();
        // Filter to show only friends
        const friendUsers = users.filter(user =>
          currentUserData?.friends?.includes(user._id)
        );
        setSearchResults(friendUsers);
      } catch (err) {
        console.error("Failed to search users:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchForUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, userId, currentUserData]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !chatroomId || !socketRef.current || !socketConnected) return;
    const message = {
      sender: userId,
      content: newMessage.trim(),
    };
    try {
      const response = await fetch(`${API_URL}/api/chatrooms/messages/${chatroomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const sentMessage = await response.json();
      // Emit to socket for real-time updates to all users
      socketRef.current.emit("sendMessage", { chatroomId, message: sentMessage });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = async (id) => {
    navigate(`/private-chat/${id}`);
    const conversation = conversations.find(c => c.id === id);
    setCurrentChatroom(conversation);
    setSearchQuery("");
    setSearchResults([]);

    // Fetch full chatroom details with participants
    try {
      const response = await fetch(`${API_URL}/api/chatrooms/participants/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentChatroom(prev => ({
          ...prev,
          participants: data.participants
        }));
      }
    } catch (err) {
      console.error("Failed to fetch chatroom participants:", err);
    }
     
    markAsRead(id)

  };

  const handleStartNewChat = async (selectedUser) => {
    // Check if user is a friend
    if (!currentUserData?.friends?.includes(selectedUser._id)) {
      alert("You can only chat with your friends. Send them a friend request first!");
      return;
    }

    try {
      // Create or get existing chatroom
      const response = await fetch(`${API_URL}/api/chatrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participants: [userId, selectedUser._id],
          isGroup: false,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create chatroom");
      }
      const chatroom = await response.json();

      // Refresh conversations list
      const conversationsResponse = await fetch(`${API_URL}/api/chatrooms/searchPri/${userId}`);
      if (conversationsResponse.ok) {
        const updatedConversations = await conversationsResponse.json();
        setConversations(updatedConversations);
      }

      // Navigate to new chat
      navigate(`/private-chat/${chatroom._id}`);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      console.error("Failed to start new chat:", err);
    }
  };

  // ============================================================================
  // RENDER LOGIC
  // ============================================================================
  const otherParticipant = currentChatroom?.participants?.find(p => p._id.toString() !== userId);
  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex overflow-hidden">
      {/* Main Sidebar */}
      <Sidebar
        isOpen={isMainSidebarOpen}
        onToggle={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
      />

      {/* LEFT SIDEBAR */}
      <div
        className={`${isSidebarOpen ? "w-80" : "w-0"
          } transition-all duration-300 bg-white border-r border-gray-200 shadow-lg flex flex-col overflow-hidden fixed ${
          isMainSidebarOpen ? "left-[260px]" : "left-0"
        } top-0 h-full z-[1002]`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white ${styles.animateFadeIn}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Messages</h2>
                <p className="text-purple-100 text-sm">
                  {conversations.length} conversations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFriendRequestsModalOpen(true)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all relative"
                title="Friend Requests"
              >
                <Bell className="w-5 h-5" />
                {friendRequestCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {friendRequestCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsPeopleModalOpen(true)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                title="Find People"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200" />
            <input
              type="text"
              placeholder="Search users to chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>
        </div>
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Search Results */}
            {searchQuery && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-2">
                  {isSearching ? "Searching..." : `Friends (${searchResults.length})`}
                </p>
                <div className="space-y-1">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleStartNewChat(user)}
                      className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
                    >
                      <img
                        src={user.profile_pic}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  ))}
                  {!isSearching && searchResults.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No friends found. Add friends using the + button above.
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-200 my-3"></div>
              </div>
            )}
            {/* Conversations */}
            <div className="space-y-1">
              {!searchQuery && conversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${chatroomId === conversation.id
                      ? "bg-purple-100 border-l-4 border-purple-500"
                      : "hover:bg-gray-50"}
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Avatar + Online + Unread Badge */}
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {conversation.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessageTime
                          ? new Date(conversation.lastMessageTime).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <p
                        className={`text-xs truncate ${conversation.unreadCount > 0
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                          }`}
                      >
                        {conversation.isTyping ? "Typing..." : conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* MAIN CHAT AREA */}
      <div
        className={`flex-1 flex flex-col ${
          isMainSidebarOpen
            ? (isSidebarOpen ? "ml-[580px]" : "ml-[260px]")
            : (isSidebarOpen ? "ml-80" : "ml-0")
          } transition-all duration-300`}
      >
        {/* Chat Header */}
        <div
          className={`bg-white border-b border-gray-200 p-4 shadow-sm fixed top-0 right-0 ${
            isMainSidebarOpen
              ? (isSidebarOpen ? "left-[580px]" : "left-[260px]")
              : (isSidebarOpen ? "left-80" : "left-0")
          } transition-all duration-300 z-30 ${styles.animateFadeIn}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentChatroom && (
                <>
                  <div className="relative">
                    <img
                      src={currentChatroom.avatar}
                      alt={currentChatroom.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {currentChatroom.isOnline && (
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                      ></div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {currentChatroom.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {currentChatroom.isOnline ? "Online" : "Last seen recently"}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Main Page"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigate("/public-chat")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Public Chat"
              >
                <Hash className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        {/* Messages Area */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 pt-20 ${styles.scrollableChat}`}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={message._id || index}
                className={`${styles.messageContainer} ${message.sender._id?.toString() === userId
                  ? `flex justify-end ${styles.animateSlideInRight}`
                  : `flex justify-start ${styles.animateSlideInLeft}`
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.sender._id?.toString() === userId
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                    }`}
                >
                  {/* Profile Picture */}
                  <div className="relative flex-shrink-0 mb-1">
                    <img
                      src={message.sender._id?.toString() === userId
                        ? currentChatroom?.participants?.find(p => p._id.toString() === userId)?.profile_pic || currentUserData?.profile_pic
                        : message.sender.profile_pic || otherParticipant?.profile_pic}
                      alt={message.sender._id?.toString() === userId
                        ? "You"
                        : message.sender.name || otherParticipant?.name}
                      className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/profile/${message.sender._id}`)}
                    />
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col">
                    <div
                      className={`${styles.floatingElement} ${message.sender._id?.toString() === userId
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                        } rounded-lg px-4 py-3 shadow-sm`}
                    >
                      <p className={`text-xs font-semibold mb-1 ${message.sender._id?.toString() === userId ? "text-purple-100" : "text-purple-600"}`}>
                        {message.sender._id?.toString() === userId
                          ? "You"
                          : message.sender.name || otherParticipant?.name}
                      </p>
                      {message.content}
                      <p
                        className={`text-xs mt-1 ${message.sender._id?.toString() === userId ? "text-purple-100" : "text-gray-500"
                          }`}
                      >
                        {new Date(message.createdAt || Date.now()).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg">Select a conversation or start a new one.</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Message Input */}
        <div
          className={`bg-white border-t border-gray-200 p-4 ${styles.animateSlideUp}`}
        >
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${currentChatroom?.name || ""}...`}
                rows="1"
                className={`${styles.messageInput} w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={newMessage.trim() === ""}
              className={`${styles.sendButton} p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* People Modal */}
      <PeopleModal
        isOpen={isPeopleModalOpen}
        onClose={() => setIsPeopleModalOpen(false)}
        onUpdate={refreshUserData}
        setIsFriendRequestsModalOpen={setIsFriendRequestsModalOpen}
      />

      {/* Friend Requests Modal */}
      <FriendRequestsModal
        isOpen={isFriendRequestsModalOpen}
        onClose={() => setIsFriendRequestsModalOpen(false)}
        onUpdate={refreshUserData}
      />
    </div>
  );
};

export default PrivateChat;