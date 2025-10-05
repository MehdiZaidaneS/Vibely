// src/import/DmPopup.jsx
import React, { useEffect, useState } from "react";
import { getUnreadPrivateChats, markAsRead } from "../api/userApi";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom"
import { AiOutlineMessage } from "react-icons/ai";

function DmPopup({ onClose }) {

  const navigate = useNavigate()
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const messages = await getUnreadPrivateChats();
        setConversations(messages || []);
      } catch (error) {
        console.error("Failed to load unread private chats:", error);
      }
    };
    fetchUnreadChats();
  }, []);

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-[1100]
                    transform transition-all duration-200 ease-out scale-100 opacity-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Direct Messages</h3>
        <button
          className="text-gray-400 hover:text-gray-700 font-bold"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Messages List */}
      <ul className="max-h-80 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <li
              key={conv.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
              onClick={async () => {
                navigate(`/private-chat/${conv.id}`);
                markAsRead(conv.id)
              }}

            >
              <div className="min-w-0">
                {/* Name */}
                <p
                  className={`text-sm truncate ${conv.unreadCount > 0
                      ? "font-semibold text-gray-900"
                      : "text-gray-800"
                    }`}
                >
                  {conv.name}
                </p>
                {/* Last Message */}
                <p
                  className={`text-sm truncate ${conv.unreadCount > 0
                      ? "font-medium text-gray-700"
                      : "text-gray-600"
                    }`}
                >
                  {conv.lastMessage}
                </p>
              </div>

              {/* Timestamp & Unread Badge */}
              <div className="text-right flex flex-col items-end space-y-1">
                <p className="text-xs text-gray-400">
                  {conv.time
                    ? formatDistanceToNow(new Date(conv.time), { addSuffix: true })
                    : ""}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-6 text-center text-gray-400 flex flex-col items-center">
            <AiOutlineMessage className="w-12 h-12 mb-2" />
            No messages yet
          </li>
        )}
      </ul>
    </div>
  );
}

export default DmPopup;
