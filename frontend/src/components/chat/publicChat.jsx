import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Users,
  Settings,
  Search,
  Smile,
  Paperclip,
  MoreVertical,
  Hash,
  Image,
  X,
  Plus,
  UserPlus,
  Bell,
  Shield,
  LogOut,
  Trash2,
  Edit,
  Pin,
  Copy,
  Flag,
} from "lucide-react";
import styles from "./publicChat.module.css";

const PublicChat = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Chat groups/channels
  const [chatGroups] = useState([
    {
      id: "general",
      name: "General",
      icon: Hash,
      members: 156,
      description: "General discussion for everyone",
    },
    {
      id: "football",
      name: "Football",
      icon: "⚽",
      members: 42,
      description: "Football fans unite!",
    },
    {
      id: "boardgames",
      name: "Board Game Party",
      icon: "🎲",
      members: 28,
      description: "Board game enthusiasts",
    },
    {
      id: "gaming",
      name: "Gaming LAN",
      icon: "🎮",
      members: 73,
      description: "PC and console gaming",
    },
    {
      id: "food",
      name: "Foodies",
      icon: "🍕",
      members: 61,
      description: "Food lovers and recipes",
    },
    {
      id: "music",
      name: "Music Lovers",
      icon: "🎵",
      members: 89,
      description: "Share your favorite tunes",
    },
  ]);

  const [activeGroup, setActiveGroup] = useState("general");

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face&auto=format",
      message: "Hey everyone! Welcome to the Vibely public chat! 🎉",
      timestamp: "2:30 PM",
      isOnline: true,
    },
    {
      id: 2,
      user: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face&auto=format",
      message:
        "Thanks for creating this space! Looking forward to meeting everyone here.",
      timestamp: "2:32 PM",
      isOnline: true,
    },
    {
      id: 3,
      user: "Marcus Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face&auto=format",
      message: "Love the design! This feels so welcoming 😊",
      timestamp: "2:35 PM",
      isOnline: false,
    },
    {
      id: 4,
      user: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face&auto=format",
      message: "Anyone interested in organizing a meetup this weekend?",
      timestamp: "2:38 PM",
      isOnline: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // UI state for modals and dropdowns
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Current user
  const currentUser = {
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face&auto=format",
    isOnline: true,
  };

  // Online users list
  const [onlineUsers] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
    },
    {
      id: 4,
      name: "Marcus Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: false,
    },
    {
      id: 5,
      name: "Lisa Park",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
    },
    {
      id: 6,
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
    },
  ]);

  // Friends data
  const [friends] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
      status: "Playing Football Manager",
      mutualFriends: 12,
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
      status: "In Gaming LAN",
      mutualFriends: 8,
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
      status: "Available",
      mutualFriends: 15,
    },
    {
      id: 4,
      name: "Marcus Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: false,
      status: "Last seen 2 hours ago",
      mutualFriends: 6,
    },
    {
      id: 5,
      name: "Lisa Park",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face&auto=format",
      isOnline: true,
      status: "In Board Game Party",
      mutualFriends: 20,
    },
  ]);

  const [friendRequests] = useState([
    {
      id: 101,
      name: "Michael Torres",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format",
      mutualFriends: 5,
      requestDate: "2 days ago",
    },
    {
      id: 102,
      name: "Jennifer Liu",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612d9e9?w=32&h=32&fit=crop&crop=face&auto=format",
      mutualFriends: 3,
      requestDate: "1 week ago",
    },
    {
      id: 103,
      name: "Robert Smith",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face&auto=format",
      mutualFriends: 7,
      requestDate: "3 days ago",
    },
  ]);

  const [suggestedFriends] = useState([
    {
      id: 201,
      name: "Anna Kim",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face&auto=format",
      mutualFriends: 12,
      reason: "12 mutual friends",
    },
    {
      id: 202,
      name: "Carlos Garcia",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face&auto=format",
      mutualFriends: 8,
      reason: "In Gaming LAN group",
    },
    {
      id: 203,
      name: "Sophie Martin",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face&auto=format",
      mutualFriends: 6,
      reason: "Lives nearby",
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
        setShowSettingsMenu(false);
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      user: currentUser.name,
      avatar: currentUser.avatar,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      isOnline: true,
      isCurrentUser: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");

    setTimeout(() => {
      simulateResponse();
    }, 2000 + Math.random() * 3000);
  };

  const simulateResponse = () => {
    const responses = [
      "That's awesome! 🎉",
      "I totally agree with that!",
      "Thanks for sharing!",
      "Great point! 👍",
      "Count me in!",
      "Love this energy! ✨",
    ];

    const randomUser =
      onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    const response = {
      id: messages.length + 2,
      user: randomUser.name,
      avatar: randomUser.avatar,
      message: randomResponse,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      isOnline: randomUser.isOnline,
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
          user: currentUser.name,
          avatar: currentUser.avatar,
          message: "",
          image: event.target.result,
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          isOnline: true,
          isCurrentUser: true,
        };
        setMessages([...messages, imageMessage]);
      };
      reader.readAsDataURL(file);
    }
    setShowImageUpload(false);
  };

  const handleAcceptFriend = (friendId) => {
    console.log("Accepting friend request:", friendId);
  };

  const handleDeclineFriend = (friendId) => {
    console.log("Declining friend request:", friendId);
  };

  const handleSendFriendRequest = (userId) => {
    console.log("Sending friend request to:", userId);
  };

  const handleRemoveFriend = (friendId) => {
    console.log("Removing friend:", friendId);
  };

  // Get current group info
  const currentGroup = chatGroups.find((group) => group.id === activeGroup);
  const groupMessages = messages.filter(
    (msg) => msg.group === activeGroup || !msg.group
  );
  const filteredUsers = onlineUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Settings menu options
  const settingsOptions = [
    {
      icon: Bell,
      label: "Notifications",
      action: () => console.log("Notifications"),
    },
    {
      icon: Users,
      label: "Manage Members",
      action: () => console.log("Manage Members"),
    },
    {
      icon: Shield,
      label: "Privacy Settings",
      action: () => console.log("Privacy"),
    },
    {
      icon: Edit,
      label: "Edit Group Info",
      action: () => console.log("Edit Group"),
    },
  ];

  // More menu options
  const moreOptions = [
    {
      icon: Copy,
      label: "Copy Group Link",
      action: () => console.log("Copy Link"),
    },
    { icon: Flag, label: "Report Group", action: () => console.log("Report") },
    {
      icon: LogOut,
      label: "Leave Group",
      action: () => console.log("Leave Group"),
      danger: true,
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 bg-white border-r border-gray-200 shadow-lg flex flex-col overflow-hidden fixed left-0 top-0 h-full z-40`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white ${styles.animateFadeIn}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                {typeof currentGroup?.icon === "string" ? (
                  <span className="text-lg">{currentGroup.icon}</span>
                ) : (
                  <Hash className="w-5 h-5" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {currentGroup?.name || "Chat"}
                </h2>
                <p className="text-purple-100 text-sm">
                  {currentGroup?.members} members
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              title="Create New Group"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200" />
            <input
              type="text"
              placeholder="Search groups or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat Groups */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Chat Groups
            </h3>
            <div className="space-y-1">
              {chatGroups.map((group, index) => (
                <div
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`${
                    styles.userListItem
                  } flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeGroup === group.id
                      ? "bg-purple-100 border-l-4 border-purple-500"
                      : "hover:bg-gray-50"
                  } ${styles.animateSlideInLeft}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold">
                    {typeof group.icon === "string" ? (
                      <span className="text-sm">{group.icon}</span>
                    ) : (
                      <group.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {group.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {group.members}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {group.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Online Users List */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Online ({filteredUsers.filter((u) => u.isOnline).length})
            </h3>
            <div className="space-y-2">
              {filteredUsers
                .filter((user) => user.isOnline)
                .map((user, index) => (
                  <div
                    key={user.id}
                    className={`${styles.userListItem} flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${styles.animateSlideInLeft}`}
                    style={{
                      animationDelay: `${(index + chatGroups.length) * 0.1}s`,
                    }}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "ml-80" : "ml-0"
        } transition-all duration-300`}
      >
        {/* Chat Header */}
        <div
          className={`bg-white border-b border-gray-200 p-4 shadow-sm fixed top-0 right-0 ${
            isSidebarOpen ? "left-80" : "left-0"
          } transition-all duration-300 z-30 ${styles.animateFadeIn}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
                >
                  <Users className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                  {typeof currentGroup?.icon === "string" ? (
                    <span className="text-lg">{currentGroup.icon}</span>
                  ) : (
                    <Hash className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {currentGroup?.name || "Chat"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {currentGroup?.members} members •{" "}
                    {onlineUsers.filter((u) => u.isOnline).length} online
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hidden lg:flex"
                title="Toggle Sidebar"
              >
                <Users className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={() => setShowFriendsModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Friends & People"
              >
                <UserPlus className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative dropdown-container">
                <button
                  onClick={() => {
                    setShowSettingsMenu(!showSettingsMenu);
                    setShowMoreMenu(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                {showSettingsMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${styles.animateFadeIn}`}
                  >
                    <div className="py-2">
                      {settingsOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            option.action();
                            setShowSettingsMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <option.icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative dropdown-container">
                <button
                  onClick={() => {
                    setShowMoreMenu(!showMoreMenu);
                    setShowSettingsMenu(false);
                  }}
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
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${
                            option.danger
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
          {groupMessages.map((message, index) => (
            <div
              key={message.id}
              className={`${styles.messageContainer} ${
                styles.animateMessageSlideIn
              } ${
                message.isCurrentUser
                  ? `flex justify-end ${styles.animateSlideInRight}`
                  : `flex justify-start ${styles.animateSlideInLeft}`
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                  message.isCurrentUser
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={message.avatar}
                    alt={message.user}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {message.isOnline && (
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                    ></div>
                  )}
                </div>

                <div
                  className={`${styles.floatingElement} ${
                    message.isCurrentUser
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  } rounded-lg px-4 py-3 shadow-sm`}
                >
                  {!message.isCurrentUser && (
                    <p className="text-xs font-medium text-purple-600 mb-1">
                      {message.user}
                    </p>
                  )}

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
                    className={`text-xs mt-1 ${
                      message.isCurrentUser
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
              <div className="flex items-end space-x-2 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div
                      className={`w-2 h-2 bg-gray-400 rounded-full ${styles.animateTyping}`}
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className={`w-2 h-2 bg-gray-400 rounded-full ${styles.animateTyping}`}
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className={`w-2 h-2 bg-gray-400 rounded-full ${styles.animateTyping}`}
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
                placeholder={`Message #${currentGroup?.name || "chat"}...`}
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
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Friends & People
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
                  <button className="w-full text-left px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                    All Friends ({friends.length})
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Friend Requests ({friendRequests.length})
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Suggestions ({suggestedFriends.length})
                  </button>
                  <button className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Find People
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
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                        Friends ({friends.length})
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
                                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {friend.name}
                                </h5>
                                <p className="text-sm text-gray-500">
                                  {friend.status}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {friend.mutualFriends} mutual friends
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  console.log("Message", friend.name)
                                }
                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                Message
                              </button>
                              <button
                                onClick={() => handleRemoveFriend(friend.id)}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {friendRequests.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                          Friend Requests ({friendRequests.length})
                        </h4>
                        <div className="space-y-3">
                          {friendRequests.map((request) => (
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
                                  <p className="text-sm text-gray-500">
                                    {request.mutualFriends} mutual friends
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Sent {request.requestDate}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleAcceptFriend(request.id)}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeclineFriend(request.id)
                                  }
                                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestedFriends.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                          People You May Know ({suggestedFriends.length})
                        </h4>
                        <div className="space-y-3">
                          {suggestedFriends.map((suggestion) => (
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
                                  <p className="text-sm text-gray-500">
                                    {suggestion.reason}
                                  </p>
                                  <p className="text-xs text-gray-400">
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

      {/* CREATE GROUP MODAL */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 ${styles.animateBounceIn}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Group
              </h3>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="Enter group name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter group description..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateGroup(false);
                    console.log("Creating new group...");
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicChat;
