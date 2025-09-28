import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Shield, Flag, UserX } from "lucide-react";

// Import all the modular components
import ChatSidebar from "./sidebar/ChatSidebar";
import ChatHeader from "./Header/ChatHeader";
import MessagesArea from "./Messages/MessagesArea";
import MessageInput from "./Input/MessageInput";
import FriendsModal from "./Modals/FriendsModal";
import NewConversationModal from "./Modals/NewConversationModal";

import styles from "./privateChat.module.css";

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
  const [friendRequestStates, setFriendRequestStates] = useState({});
  const [showFriendsModal, setShowFriendsModal] = useState(false);

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

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: messages.length + 1,
      senderId: "you",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      isCurrentUser: true,
    };

    setMessages([...messages, message]);
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
      {/* Chat Sidebar */}
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        conversations={filteredConversations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        setShowNewConversation={setShowNewConversation}
        styles={styles}
      />

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "ml-80" : "ml-0"
        } transition-all duration-300`}
      >
        <ChatHeader
          currentConversation={currentConversation}
          isSidebarOpen={isSidebarOpen}
          navigate={navigate}
          setShowFriendsModal={setShowFriendsModal}
          showMoreMenu={showMoreMenu}
          setShowMoreMenu={setShowMoreMenu}
          moreOptions={moreOptions}
          styles={styles}
        />

        <MessagesArea
          messages={messages}
          currentConversation={currentConversation}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          styles={styles}
        />

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          currentConversation={currentConversation}
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
      <FriendsModal
        showFriendsModal={showFriendsModal}
        setShowFriendsModal={setShowFriendsModal}
        allUsers={allUsers}
        handleSendFriendRequest={handleSendFriendRequest}
        handleAcceptFriendRequest={handleAcceptFriendRequest}
        handleDeclineFriendRequest={handleDeclineFriendRequest}
        setActiveConversation={setActiveConversation}
        styles={styles}
      />

      {/* New Conversation Modal */}
      <NewConversationModal
        showNewConversation={showNewConversation}
        setShowNewConversation={setShowNewConversation}
        allUsers={allUsers}
        conversations={conversations}
        handleStartConversation={handleStartConversation}
        handleSendFriendRequest={handleSendFriendRequest}
        handleAcceptFriendRequest={handleAcceptFriendRequest}
        handleDeclineFriendRequest={handleDeclineFriendRequest}
        friendRequestStates={friendRequestStates}
        setActiveConversation={setActiveConversation}
        styles={styles}
      />
    </div>
  );
};

export default PrivateChat;
