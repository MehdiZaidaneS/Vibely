import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Users, Search, ChevronLeft, Home, Hash } from "lucide-react";
import io from "socket.io-client";
import styles from "./privateChat.module.css";

const API_URL = "http://localhost:5000";
const socket = io(API_URL);

const PrivateChat = () => {
  const navigate = useNavigate();
  const { chatroomId } = useParams();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentChatroom, setCurrentChatroom] = useState(null);

  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("userId");

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Effect 1: Fetch chatrooms and set current chatroom
  useEffect(() => {
    const getChatrooms = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chatrooms/search/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chatrooms");
        }
        const chatrooms = await response.json();
        setConversations(chatrooms);
        console.log(chatrooms);
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

  // Effect 4: Auto-scroll to the bottom of the message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !chatroomId) return;
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
      setMessages((prev) => [...prev, sentMessage]);
      socket.emit("sendMessage", { chatroomId, message: sentMessage });
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

  const handleSelectConversation = (id) => {
    navigate(`/private-chat/${id}`);
    const conversation = conversations.find(c => c.id === id);
    setCurrentChatroom(conversation);
  };
  useEffect(() => {
    const getMessages = async () => {
      if (!chatroomId) {
        setMessages([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/chatrooms/history/${chatroomId}`);
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

  // ============================================================================
  // RENDER LOGIC
  // ============================================================================
  const otherParticipant = currentChatroom?.participants?.find(p => p._id.toString() !== userId);
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
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-200" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              disabled
            />
          </div>
        </div>
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-1">
              {conversations.map((conversation, index) => (
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
                      src={conversation.avatar || "/default-avatar.png"}
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
                  src={currentChatroom?.avatar || "/default-avatar.png"}
                  alt={currentChatroom?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {currentChatroom?.isOnline && (
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full ${styles.animateOnlineIndicator}`}
                  ></div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentChatroom?.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentChatroom?.isOnline ? "Online" : "Last seen recently"}
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
                  {console.log(message.sender._id)}
                  {message.sender._id?.toString() !== userId && (
                    <div className="relative flex-shrink-0">
                      <img
                        src={otherParticipant?.avatar || "/default-avatar.png"}
                        alt={otherParticipant?.name || 'Unknown User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`${styles.floatingElement} ${message.sender._id?.toString() === userId
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                      } rounded-lg px-4 py-3 shadow-sm`}
                  >
                    {message.content}
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
    </div>
  );
};

export default PrivateChat;