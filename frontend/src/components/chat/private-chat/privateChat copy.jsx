import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Users,
  Search,
  Smile,
  Paperclip,
  MoreVertical,
  Image,
  X,
  Plus,
  Bell,
  Shield,
  Flag,
  UserX,
  UserPlus,
  Home,
  Hash,
} from "lucide-react";
import styles from "./privateChat.module.css";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const PrivateChat = () => {
  const navigate = useNavigate();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [conversations] = useState([
    {
      id: "alex",
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face&auto=format",
      lastMessage: "Hey! How was your day?",
      timestamp: "2:45 PM",
      isOnline: true,
      unreadCount: 3,
      isTyping: false,
    },
    {
      id: "sarah",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face&auto=format",
      lastMessage: "Thanks for the help earlier!",
      timestamp: "1:30 PM",
      isOnline: true,
      unreadCount: 0,
      isTyping: false,
    },
    {
      id: "marcus",
      name: "Marcus Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face&auto=format",
      lastMessage: "See you at the game tonight!",
      timestamp: "11:15 AM",
      isOnline: false,
      unreadCount: 0,
      isTyping: false,
    },
    {
      id: "emma",
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face&auto=format",
      lastMessage: "That sounds like a great plan!",
      timestamp: "Yesterday",
      isOnline: true,
      unreadCount: 1,
      isTyping: false,
    },
    {
      id: "lisa",
      name: "Lisa Park",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face&auto=format",
      lastMessage: "Can't wait for the weekend!",
      timestamp: "Yesterday",
      isOnline: false,
      unreadCount: 0,
      isTyping: false,
    },
  ]);

  const [activeConversation, setActiveConversation] = useState("alex");

  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: "alex",
      message: "Hey there! How's your day going?",
      timestamp: "2:30 PM",
      isCurrentUser: false,
    },
    {
      id: 2,
      senderId: "you",
      message: "Pretty good! Just working on some projects. How about you?",
      timestamp: "2:32 PM",
      isCurrentUser: true,
    },
    {
      id: 3,
      senderId: "alex",
      message:
        "Same here! Working on that presentation for tomorrow. Are you free for a quick call later?",
      timestamp: "2:35 PM",
      isCurrentUser: false,
    },
    {
      id: 4,
      senderId: "you",
      message: "Sure! What time works for you?",
      timestamp: "2:37 PM",
      isCurrentUser: true,
    },
    {
      id: 5,
      senderId: "alex",
      message: "How about 4 PM? We can go over the details then.",
      timestamp: "2:40 PM",
      isCurrentUser: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // UI state for modals and dropdowns
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [friendRequestStates, setFriendRequestStates] = useState({});
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friendsModalTab, setFriendsModalTab] = useState("friends");

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // All available users for searching with friendship status
  const [allUsers] = useState([
    {
      id: "alex",
      name: "Alex Johnson",
      username: "@alexj",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: true,
      mutualFriends: 12,
      friendshipStatus: "friends",
    },
    {
      id: "sarah",
      name: "Sarah Chen",
      username: "@sarahc",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: true,
      mutualFriends: 8,
      friendshipStatus: "friends",
    },
    {
      id: "marcus",
      name: "Marcus Rodriguez",
      username: "@marcusr",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: false,
      mutualFriends: 6,
      friendshipStatus: "friends",
    },
    {
      id: "emma",
      name: "Emma Wilson",
      username: "@emmaw",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: true,
      mutualFriends: 15,
      friendshipStatus: "friends",
    },
    {
      id: "lisa",
      name: "Lisa Park",
      username: "@lisap",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: false,
      mutualFriends: 20,
      friendshipStatus: "friends",
    },
    {
      id: "michael",
      name: "Michael Torres",
      username: "@michaelt",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: true,
      mutualFriends: 5,
      friendshipStatus: "pending_received",
    },
    {
      id: "jennifer",
      name: "Jennifer Liu",
      username: "@jenliu",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612d9e9?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: false,
      mutualFriends: 3,
      friendshipStatus: "pending_sent",
    },
    {
      id: "david",
      name: "David Kim",
      username: "@davidk",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: true,
      mutualFriends: 9,
      friendshipStatus: "not_friends",
    },
    {
      id: "anna",
      name: "Anna Thompson",
      username: "@annat",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format",
      isOnline: true,
      mutualFriends: 4,
      friendshipStatus: "not_friends",
    },
  ]);


  // Emoji picker data
  const emojiCategories = {
    Smileys: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
    ],
    Gestures: [
      "👍",
      "👎",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "🖕",
      "👇",
      "☝️",
      "👋",
      "🤚",
    ],
    Objects: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
    ],
    Activities: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
    ],
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let timeout;
    if (newMessage.length > 0) {
      setIsTyping(true);
      timeout = setTimeout(() => setIsTyping(false), 1000);
    } else {
      setIsTyping(false);
    }
    return () => clearTimeout(timeout);
  }, [newMessage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowEmojiPicker(false);
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  useEffect(() => {
    socket.emit("joinRoom", roomId);
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      sender: localStorage.getItem("userId"),
      content: newMessage,
      type: "text",
    };
    fetch(`/api/chatrooms/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

    setMessages((prev) => [...prev, message]);
    socket.emit("sendMessage", { roomId, message });
    setNewMessage("");

    setTimeout(() => {
      simulateResponse();
    }, 1000 + Math.random() * 2000);
  };

  const simulateResponse = () => {
    const responses = [
      "That sounds great!",
      "I totally agree with you!",
      "Thanks for letting me know!",
      "Awesome! 👍",
      "Perfect timing!",
      "Let me think about it...",
      "Sounds like a plan!",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    const response = {
      id: messages.length + 2,
      senderId: activeConversation,
      message: randomResponse,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      isCurrentUser: false,
    };

    setMessages((prev) => [...prev, response]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageMessage = {
          id: messages.length + 1,
          senderId: "you",
          message: "",
          image: event.target.result,
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          isCurrentUser: true,
        };
        setMessages([...messages, imageMessage]);
      };
      reader.readAsDataURL(file);
    }
    setShowImageUpload(false);
  };

  const handleStartConversation = (userId) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user && user.friendshipStatus === "friends") {
      const userExists = conversations.find((conv) => conv.id === userId);
      if (!userExists) {
        console.log("Starting new conversation with friend:", userId);
      }
      setActiveConversation(userId);
      setShowNewConversation(false);
      setUserSearchQuery("");
    }
  };

  const handleSendFriendRequest = (userId) => {
    console.log("Sending friend request to:", userId);
    setFriendRequestStates((prev) => ({
      ...prev,
      [userId]: "pending",
    }));
  };

  const handleAcceptFriendRequest = (userId) => {
    console.log("Accepting friend request from:", userId);
    setFriendRequestStates((prev) => ({
      ...prev,
      [userId]: "accepted",
    }));
  };

  const handleDeclineFriendRequest = (userId) => {
    console.log("Declining friend request from:", userId);
    setFriendRequestStates((prev) => ({
      ...prev,
      [userId]: "declined",
    }));
  };

  // Get current conversation info
  const currentConversation = conversations.find(
    (conv) => conv.id === activeConversation
  );

  // Only show conversations with friends
  const filteredConversations = conversations.filter((conv) => {
    const user = allUsers.find((u) => u.id === conv.id);
    return (
      user &&
      user.friendshipStatus === "friends" &&
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter users for new conversation search
  const filteredUsers = allUsers.filter((user) => {
    const searchLower = userSearchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
  });

  // Get categorized friends
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

  // More menu options
  const moreOptions = [
    {
      icon: Bell,
      label: "Notifications",
      action: () => console.log("Notifications"),
    },
    {
      icon: Flag,
      label: "Report User",
      action: () => console.log("Report"),
      danger: true,
    },
    {
      icon: Shield,
      label: "Block User",
      action: () => console.log("Block"),
      danger: true,
    },
    {
      icon: UserX,
      label: "Remove Friend",
      action: () => console.log("Remove Friend"),
      danger: true,
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div
        className={`${isSidebarOpen ? "w-80" : "w-0"
          } transition-all duration-300 bg-white border-r border-gray-200 shadow-lg flex flex-col overflow-hidden fixed left-0 top-0 h-full z-40`}
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
            <button
              onClick={() => setShowNewConversation(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-1">
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`${styles.userListItem
                    } flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activeConversation === conversation.id
                      ? "bg-purple-100 border-l-4 border-purple-500"
                      : "hover:bg-gray-50"
                    } ${styles.animateSlideInLeft}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.isOnline && (
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                      ></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {conversation.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <p
                        className={`text-xs truncate ${conversation.unreadCount > 0
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                          }`}
                      >
                        {conversation.isTyping
                          ? "Typing..."
                          : conversation.lastMessage}
                      </p>
                      {conversation.isTyping && (
                        <div className="ml-2 flex space-x-1">
                          <div
                            className={`w-1 h-1 bg-purple-500 rounded-full ${styles.animateTyping}`}
                            style={{ animationDelay: "0s" }}
                          ></div>
                          <div
                            className={`w-1 h-1 bg-purple-500 rounded-full ${styles.animateTyping}`}
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className={`w-1 h-1 bg-purple-500 rounded-full ${styles.animateTyping}`}
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      )}
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
        className={`flex-1 flex flex-col ${isSidebarOpen ? "ml-80" : "ml-0"
          } transition-all duration-300`}
      >
        {/* Chat Header */}
        <div
          className={`bg-white border-b border-gray-200 p-4 shadow-sm fixed top-0 right-0 ${isSidebarOpen ? "left-80" : "left-0"
            } transition-all duration-300 z-30 ${styles.animateFadeIn}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={currentConversation?.avatar}
                  alt={currentConversation?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {currentConversation?.isOnline && (
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                  ></div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentConversation?.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentConversation?.isOnline
                    ? "Online"
                    : "Last seen recently"}
                </p>
              </div>
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

              <button
                onClick={() => setShowFriendsModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Friends"
              >
                <UserPlus className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                {showMoreMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${styles.animateFadeIn}`}
                  >
                    <div className="py-2">
                      {moreOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            option.action();
                            setShowMoreMenu(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${option.danger
                              ? "text-red-600 hover:bg-red-50"
                              : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          <option.icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 pt-20 ${styles.scrollableChat}`}
        >
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`${styles.messageContainer} ${styles.animateMessageSlideIn
                } ${message.isCurrentUser
                  ? `flex justify-end ${styles.animateSlideInRight}`
                  : `flex justify-start ${styles.animateSlideInLeft}`
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.isCurrentUser
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                  }`}
              >
                {!message.isCurrentUser && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={currentConversation?.avatar}
                      alt={currentConversation?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {currentConversation?.isOnline && (
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                      ></div>
                    )}
                  </div>
                )}

                <div
                  className={`${styles.floatingElement} ${message.isCurrentUser
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                    } rounded-lg px-4 py-3 shadow-sm`}
                >
                  {message.image && (
                    <div className="mb-2">
                      <img
                        src={message.image}
                        alt="Shared image"
                        className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(message.image, "_blank")}
                      />
                    </div>
                  )}

                  {message.message && (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                  )}

                  <p
                    className={`text-xs mt-1 ${message.isCurrentUser
                        ? "text-purple-100"
                        : "text-gray-500"
                      }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className={`flex justify-end ${styles.animateFadeIn}`}>
              <div className="flex items-end space-x-2 max-w-xs flex-row-reverse space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div
                      className={`w-2 h-2 bg-white rounded-full ${styles.animateTyping}`}
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className={`w-2 h-2 bg-white rounded-full ${styles.animateTyping}`}
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className={`w-2 h-2 bg-white rounded-full ${styles.animateTyping}`}
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
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
            <div className="relative dropdown-container">
              <button
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              {showImageUpload && (
                <div
                  className={`absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 ${styles.animateFadeIn}`}
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 whitespace-nowrap"
                  >
                    <Image className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 relative">
              <textarea
                ref={messageInputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${currentConversation?.name || ""}...`}
                rows="1"
                className={`${styles.messageInput} w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 dropdown-container">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {showEmojiPicker && (
                  <div
                    className={`absolute bottom-12 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${styles.animateFadeIn}`}
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Choose an emoji
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {Object.entries(emojiCategories).map(
                          ([category, emojis]) => (
                            <div key={category}>
                              <h4 className="text-xs font-medium text-gray-500 mb-2">
                                {category}
                              </h4>
                              <div className="grid grid-cols-8 gap-1">
                                {emojis.map((emoji, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleEmojiSelect(emoji)}
                                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors duration-200"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

      {/* FRIENDS MODAL */}
      {showFriendsModal && (
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    Friends
                  </h3>
                  <p className="text-sm text-gray-500">
                    Manage your connections
                  </p>
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
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${friendsModalTab === "friends"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Friends ({friends.length})
                  </button>
                  <button
                    onClick={() => setFriendsModalTab("requests")}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${friendsModalTab === "requests"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Requests ({pendingRequests.length})
                  </button>
                  <button
                    onClick={() => setFriendsModalTab("sent")}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${friendsModalTab === "sent"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Sent ({sentRequests.length})
                  </button>
                  <button
                    onClick={() => setFriendsModalTab("suggestions")}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${friendsModalTab === "suggestions"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    Suggestions ({suggestions.length})
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
                                    ></div>
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {friend.name}
                                  </h5>
                                  <p className="text-sm text-purple-600">
                                    {friend.username}
                                  </p>
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
                                  onClick={() =>
                                    console.log("Remove friend", friend.id)
                                  }
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
                          Friend Requests ({pendingRequests.length})
                        </h4>
                        <div className="space-y-3">
                          {pendingRequests.map((request) => (
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
                                  <p className="text-sm text-purple-600">
                                    {request.username}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {request.mutualFriends} mutual friends
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleAcceptFriendRequest(request.id)
                                  }
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeclineFriendRequest(request.id)
                                  }
                                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          ))}
                          {pendingRequests.length === 0 && (
                            <div className="text-center py-8">
                              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
                          Sent Requests ({sentRequests.length})
                        </h4>
                        <div className="space-y-3">
                          {sentRequests.map((request) => (
                            <div
                              key={request.id}
                              className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
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
                                  <p className="text-sm text-purple-600">
                                    {request.username}
                                  </p>
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
                                  onClick={() =>
                                    console.log("Cancel request", request.id)
                                  }
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ))}
                          {sentRequests.length === 0 && (
                            <div className="text-center py-8">
                              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 text-sm">
                                No sent friend requests
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Suggestions Tab */}
                    {friendsModalTab === "suggestions" && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                          People You May Know ({suggestions.length})
                        </h4>
                        <div className="space-y-3">
                          {suggestions.map((suggestion) => (
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
                                  onClick={() =>
                                    handleSendFriendRequest(suggestion.id)
                                  }
                                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  Add Friend
                                </button>
                                <button
                                  onClick={() =>
                                    console.log(
                                      "Remove suggestion",
                                      suggestion.id
                                    )
                                  }
                                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          {suggestions.length === 0 && (
                            <div className="text-center py-8">
                              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
      )}

      {/* NEW CONVERSATION MODAL */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col ${styles.animateBounceIn}`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    New Conversation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Search for users to start chatting
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNewConversation(false);
                  setUserSearchQuery("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or username..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {userSearchQuery === "" ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Start typing to search for users
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No users found matching "{userSearchQuery}"
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user, index) => {
                    const hasExistingConversation = conversations.find(
                      (conv) => conv.id === user.id
                    );
                    const currentFriendState =
                      friendRequestStates[user.id] || user.friendshipStatus;

                    const renderActionButton = () => {
                      switch (currentFriendState) {
                        case "friends":
                          return hasExistingConversation ? (
                            <button
                              onClick={() => {
                                setActiveConversation(user.id);
                                setShowNewConversation(false);
                                setUserSearchQuery("");
                              }}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Open Chat
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartConversation(user.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Start Chat
                            </button>
                          );

                        case "pending_sent":
                        case "pending":
                          return (
                            <button
                              disabled
                              className="px-3 py-1 bg-gray-400 text-white text-sm rounded-lg cursor-not-allowed"
                            >
                              Request Sent
                            </button>
                          );

                        case "pending_received":
                          return (
                            <div className="flex space-x-1">
                              <button
                                onClick={() =>
                                  handleAcceptFriendRequest(user.id)
                                }
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleDeclineFriendRequest(user.id)
                                }
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          );

                        default:
                          return (
                            <button
                              onClick={() => handleSendFriendRequest(user.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Add Friend
                            </button>
                          );
                      }
                    };

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${styles.animateSlideInLeft}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {user.isOnline && (
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                              ></div>
                            )}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {user.name}
                            </h5>
                            <p className="text-sm text-purple-600">
                              {user.username}
                            </p>
                            <div className="flex items-center space-x-2">
                              <p className="text-xs text-gray-500">
                                {user.mutualFriends} mutual friends
                              </p>
                              {currentFriendState === "friends" && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  Friends
                                </span>
                              )}
                              {currentFriendState === "pending_received" && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  Wants to connect
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {renderActionButton()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateChat;
