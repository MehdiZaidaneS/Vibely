import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Edit, Copy, Flag, Users } from "lucide-react";

// Import modular components
import PublicChatSidebar from "./Sidebar/PublicChatSidebar";
import PublicChatHeader from "./Header/PublicChatHeader";
import PublicMessagesArea from "./Messages/PublicMessagesArea";
import PublicMessageInput from "./Input/PublicMessageInput";
import PublicFriendsModal from "./Modals/PublicFriendsModal";
import CreateGroupModal from "./Modals/CreateGroupModal";

// Import CSS module
import styles from "./publicChat.module.css";

const PublicChat = () => {
  const navigate = useNavigate();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Chat groups/channels
  const [chatGroups] = useState([
    {
      id: "general",
      name: "General",
      icon: "Hash",
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

  const handleCreateGroup = (groupData) => {
    console.log("Creating new group:", groupData);
    setShowCreateGroup(false);
  };

  // Get current group info
  const currentGroup = chatGroups.find((group) => group.id === activeGroup);
  const groupMessages = messages.filter(
    (msg) => msg.group === activeGroup || !msg.group
  );
  const filteredUsers = onlineUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // More menu options
  const moreOptions = [
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
      icon: Edit,
      label: "Edit Group Info",
      action: () => console.log("Edit Group"),
    },
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
      {/* Public Chat Sidebar */}
      <PublicChatSidebar
        isSidebarOpen={isSidebarOpen}
        chatGroups={chatGroups}
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
        onlineUsers={filteredUsers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowCreateGroup={setShowCreateGroup}
        currentGroup={currentGroup}
        styles={styles}
      />

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "ml-80" : "ml-0"
        } transition-all duration-300`}
      >
        <PublicChatHeader
          currentGroup={currentGroup}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onlineUsers={onlineUsers}
          navigate={navigate}
          setShowFriendsModal={setShowFriendsModal}
          showMoreMenu={showMoreMenu}
          setShowMoreMenu={setShowMoreMenu}
          moreOptions={moreOptions}
          styles={styles}
        />

        <PublicMessagesArea
          messages={groupMessages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          styles={styles}
        />

        <PublicMessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          currentGroup={currentGroup}
          messageInputRef={messageInputRef}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          showImageUpload={showImageUpload}
          setShowImageUpload={setShowImageUpload}
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          emojiCategories={emojiCategories}
          handleEmojiSelect={handleEmojiSelect}
          styles={styles}
        />
      </div>

      {/* Friends Modal */}
      <PublicFriendsModal
        showFriendsModal={showFriendsModal}
        setShowFriendsModal={setShowFriendsModal}
        friends={friends}
        friendRequests={friendRequests}
        suggestedFriends={suggestedFriends}
        handleAcceptFriend={handleAcceptFriend}
        handleDeclineFriend={handleDeclineFriend}
        handleSendFriendRequest={handleSendFriendRequest}
        handleRemoveFriend={handleRemoveFriend}
        styles={styles}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        showCreateGroup={showCreateGroup}
        setShowCreateGroup={setShowCreateGroup}
        handleCreateGroup={handleCreateGroup}
        styles={styles}
      />
    </div>
  );
};

export default PublicChat;
