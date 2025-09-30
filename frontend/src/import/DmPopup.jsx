// src/import/DmPopup.jsx
import React from "react";

function DmPopup({ onClose }) {
  // Mock data for DM conversations
  const conversations = [
    { id: 1, user: "Alice", lastMessage: "Hey, are you coming to the event?", time: "5 min ago", unread: 2 },
    { id: 2, user: "Bob", lastMessage: "Thanks for the invite!", time: "1 hour ago", unread: 0 },
    { id: 3, user: "Charlie", lastMessage: "Let's discuss the details.", time: "Yesterday", unread: 1 },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Direct Messages</h3>
        <button className="text-sm text-blue-600 hover:underline" onClick={() => console.log("New message")}>
          New
        </button>
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <li
              key={conv.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() => console.log("DM clicked:", conv.user)} // Placeholder for opening chat
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{conv.user}</p>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{conv.time}</p>
                {conv.unread > 0 && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                    {conv.unread}
                  </span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No messages</li>
        )}
      </ul>
      <div className="p-4 border-t border-gray-200 text-center">
        <button className="text-sm text-blue-600 hover:underline" onClick={() => console.log("View all messages")}>
          View all
        </button>
      </div>
    </div>
  );
}

export default DmPopup;