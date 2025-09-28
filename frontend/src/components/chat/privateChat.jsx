import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell, Shield, Flag, UserX } from "lucide-react";
import io from "socket.io-client";

// Import all the modular components
import ChatSidebar from "./sidebar/ChatSidebar";
import ChatHeader from "./Header/ChatHeader";
import MessagesArea from "./Messages/MessagesArea";
import MessageInput from "./Input/MessageInput";
import FriendsModal from "./Modals/FriendsModal";
import NewConversationModal from "./Modals/NewConversationModal";

// Import CSS module
import styles from "./privateChat.module.css";

const API_URL = "http://localhost:5000";
const socket = io(API_URL);

const PrivateChat = () => {
  const navigate = useNavigate();
  const { chatroomId } = useParams();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Backend-integrated state
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentChatroom, setCurrentChatroom] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // UI state for modals and dropdowns
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [friendRequestStates, setFriendRequestStates] = useState({});
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // All available users for searching with friendship status (mock data for now)
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
  // BACKEND INTEGRATION EFFECTS
  // ============================================================================

  // Effect 1: Fetch chatrooms and set current chatroom
  useEffect(() => {
    const getChatrooms = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `${API_URL}/api/chatrooms/search/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chatrooms");
        }
        const chatrooms = await response.json();
        setConversations(chatrooms);

        if (chatroomId) {
          const room = chatrooms.find((c) => c.id === chatroomId);
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
  }, [userId, chatroomId, navigate]);

  // Effect 2: Fetch messages for the active chatroom
  useEffect(() => {
    const getMessages = async () => {
      if (!chatroomId) {
        setMessages([]);
        return;
      }
      try {
        const response = await fetch(
          `${API_URL}/api/chatrooms/history/${chatroomId}`
        );
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
    if (!chatroomId) return;

    socket.emit("joinRoom", chatroomId);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.emit("leaveRoom", chatroomId);
    };
  }, [chatroomId]);

  // ============================================================================
  // UI EFFECTS
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
  // BACKEND EVENT HANDLERS
  // ============================================================================

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !chatroomId) return;

    const message = {
      sender: userId,
      content: newMessage.trim(),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/chatrooms/messages/${chatroomId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const sentMessage = await response.json();
      setMessages((prev) => [...prev, sentMessage]);
      socket.emit("sendMessage", { chatroomId, message: sentMessage });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSelectConversation = (id) => {
    navigate(`/private-chat/${id}`);
  };

  // ============================================================================
  // UI EVENT HANDLERS
  // ============================================================================

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
      handleSelectConversation(userId);
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

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  // Get the other participant for display
  const otherParticipant = currentChatroom?.participants?.find(
    (p) => p._id?.toString() !== userId
  );

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* Chat Sidebar */}
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        conversations={filteredConversations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeConversation={chatroomId}
        setActiveConversation={handleSelectConversation}
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
          currentConversation={currentChatroom}
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
          currentConversation={currentChatroom}
          otherParticipant={otherParticipant}
          userId={userId}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          styles={styles}
        />

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          currentConversation={currentChatroom}
          chatroomId={chatroomId}
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
        setActiveConversation={handleSelectConversation}
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
        setActiveConversation={handleSelectConversation}
        styles={styles}
      />
    </div>
  );
};

export default PrivateChat;
