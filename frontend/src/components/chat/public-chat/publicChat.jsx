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
import PublicFriendsModal from "./Modals/PublicFriendsModal";
import CreateGroupModal from "./Modals/CreateGroupModal";

const API_URL = "http://localhost:5000";
const socket = io(API_URL);

const PublicChat = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

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
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);

  // UI state for modals and dropdowns
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

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

  // Effect 1: Fetch chat groups on initial load
  useEffect(() => {
    const getChatGroups = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chatrooms/searchPub/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch public groups");
        const groups = await response.json();
        setChatGroups(groups);
        if (groups.length > 0 && !activeGroup) {
          setActiveGroup(groups[0].id); // Set the first group as active
        }
      } catch (err) {
        console.error("Failed to fetch public groups:", err);
      }
    };
    getChatGroups();
  }, [activeGroup]);

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
    if (!activeGroup) return;

    socket.emit("joinRoom", activeGroup);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.emit("leaveRoom", activeGroup);
    };
  }, [activeGroup]);

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
    if (newMessage.trim() === "" || !activeGroup) return;
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
      setMessages((prev) => [...prev, sentMessage]);
      socket.emit("sendMessage", { chatroomId: activeGroup, message: sentMessage });
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

  const handleCreateGroup = async (groupData) => {
    try {
      const payload =JSON.stringify({
          name: groupData.name,
          description: groupData.description,
          isGroup: true,
          participants: [userId], })
      console.log(payload);
      const response = await fetch(`${API_URL}/api/chatrooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
        ,
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const newGroup = await response.json();
      setChatGroups((prev) => [...prev, newGroup]); // Update the group list
      setActiveGroup(newGroup.id); // Set the new group as active
      setShowCreateGroup(false); // Close the modal

      console.log("Successfully created new group:", newGroup);
    } catch (error) {
      console.error("Error creating group:", error);
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
        className={`flex-1 flex flex-col ${isSidebarOpen ? "ml-80" : "ml-0"
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