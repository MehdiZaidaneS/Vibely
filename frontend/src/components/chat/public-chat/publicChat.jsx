import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Edit, Copy, Flag, Users } from "lucide-react";
import io from "socket.io-client";
import styles from "./publicChat.module.css";
// Import modular components
import PublicChatSidebar from "./Sidebar/PublicChatSidebar";
import PublicChatHeader from "./Header/PublicChatHeader";
import PublicMessagesArea from "./Messages/PublicMessagesArea";
import PublicMessageInput from "./Input/PublicMessageInput";
import PeopleModal from "../PeopleModal";
import CreateGroupModal from "./Modals/CreateGroupModal";
import Sidebar from "../../../import/Sidebar";

const API_URL = "http://localhost:5000";

const PublicChat = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const socketRef = useRef(null);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [chatGroups, setChatGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  // UI state for modals and dropdowns
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Current user (can be fetched or from a global state)
  const currentUser = {
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face&auto=format",
    isOnline: true,
  };

  // Emoji picker data
  const emojiCategories = {
    Smileys: [
      "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    ],
    Gestures: [
      "👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚",
    ],
    Objects: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝",
    ],
    Activities: [
      "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃",
    ],
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Effect 0: Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io(API_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      setSocketConnected(true);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setSocketConnected(false);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Effect 1: Fetch chat groups on initial load
  useEffect(() => {
    const getChatGroups = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chatrooms/searchPub/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch public groups");
        const groups = await response.json();
        setChatGroups(groups);

        // Set first group as active
        if (groups.length > 0 && !activeGroup) {
          setActiveGroup(groups[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch public groups:", err);
      }
    };
    getChatGroups();
  }, [userId]);

  // Effect 2: Fetch messages for the active group
  useEffect(() => {
    const getMessages = async () => {
      if (!activeGroup) {
        setMessages([]);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/chatrooms/history/${activeGroup}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const msgs = await response.json();
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };
    getMessages();
  }, [activeGroup]);

  // Effect 3: Handle real-time WebSocket communication
  useEffect(() => {
    if (!activeGroup || !socketRef.current || !socketConnected) return;

    console.log('Joining room:', activeGroup);
    socketRef.current.emit("joinRoom", activeGroup);

    const handleNewMessage = (message) => {
      console.log('Received message:', message);
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
  }, [activeGroup, socketConnected]);

  // Effect 4: Auto-scroll to the bottom of the message list
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

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeGroup || !socketRef.current || !socketConnected) return;

    const message = {
      sender: userId,
      content: newMessage.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/api/chatrooms/messages/${activeGroup}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const sentMessage = await response.json();
      socketRef.current.emit("sendMessage", { chatroomId: activeGroup, message: sentMessage });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await fetch(`${API_URL}/api/chatrooms/join/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to join group");
        return;
      }

      // Refresh the groups list
      const groupsResponse = await fetch(`${API_URL}/api/chatrooms/searchPub/${userId}`);
      if (groupsResponse.ok) {
        const groups = await groupsResponse.json();
        setChatGroups(groups);
        // Set the joined group as active
        setActiveGroup(groupId);
      }
    } catch (err) {
      console.error("Failed to join group:", err);
      alert("Error joining group. Please try again.");
    }
  };

  const handleLeaveGroup = async () => {
    if (!activeGroup) return;

    if (!window.confirm("Are you sure you want to leave this group?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/chatrooms/leave/${activeGroup}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to leave group");
        return;
      }

      // Refresh groups list
      const groupsResponse = await fetch(`${API_URL}/api/chatrooms/searchPub/${userId}`);
      if (groupsResponse.ok) {
        const groups = await groupsResponse.json();
        setChatGroups(groups);

        // Set first joined group as active, or null
        const memberGroup = groups.find(g => g.isMember);
        setActiveGroup(memberGroup ? memberGroup.id : null);
      }

      alert("Left group successfully");
    } catch (err) {
      console.error("Failed to leave group:", err);
      alert("Error leaving group. Please try again.");
    }
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

  const handleCreateGroup = async (groupData) => {
    try {
      const response = await fetch(`${API_URL}/api/chatrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupData.name,
          description: groupData.description,
          isGroup: true,
          participants: [userId],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to create group");
        return;
      }

      const newGroup = await response.json();

      // Refresh groups list
      const groupsResponse = await fetch(`${API_URL}/api/chatrooms/searchPub/${userId}`);
      if (groupsResponse.ok) {
        const groups = await groupsResponse.json();
        setChatGroups(groups);
      }

      setActiveGroup(newGroup._id);
      setShowCreateGroup(false);

      console.log("Successfully created new group:", newGroup);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Error creating group. Please try again.");
    }
  };

  // Get current group info
  const currentGroup = chatGroups.find((group) => group.id === activeGroup);
  const groupMessages = messages.filter(
    (msg) => msg.group === activeGroup || !msg.group
  );
  const filteredUsers = onlineUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex overflow-hidden">
      {/* Main Sidebar */}
      <Sidebar
        isOpen={isMainSidebarOpen}
        onToggle={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
      />

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
        onJoinGroup={handleJoinGroup}
        userId={userId}
        isMainSidebarOpen={isMainSidebarOpen}
      />

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          isMainSidebarOpen
            ? (isSidebarOpen ? "ml-[580px]" : "ml-[260px]")
            : (isSidebarOpen ? "ml-80" : "ml-0")
          } transition-all duration-300`}
      >
        <PublicChatHeader
          currentGroup={currentGroup}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onlineUsers={onlineUsers}
          navigate={navigate}
          setShowFriendsModal={setShowFriendsModal}
          styles={styles}
          isMainSidebarOpen={isMainSidebarOpen}
        />

        <PublicMessagesArea
          messages={groupMessages}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          styles={styles}
          userId={userId}
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

      {/* People Modal */}
      <PeopleModal
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
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