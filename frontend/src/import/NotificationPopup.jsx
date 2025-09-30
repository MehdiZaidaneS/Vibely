// src/import/NotificationPopup.jsx
import React from "react";

function NotificationPopup({ onClose }) {
  // Mock data for notifications
  const notifications = [
    { id: 1, message: "John joined your event 'Football Match'", time: "2 hours ago", unread: true },
    { id: 2, message: "New comment on 'Tech Conference'", time: "1 day ago", unread: false },
    { id: 3, message: "Event 'Music Festival' is starting soon", time: "3 days ago", unread: false },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notif.unread ? "bg-blue-50" : ""}`}
              onClick={() => console.log("Notification clicked:", notif.message)} // Placeholder for navigation/action
            >
              <p className="text-sm text-gray-800">{notif.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No notifications</li>
        )}
      </ul>
      <div className="p-4 border-t border-gray-200 text-center">
        <button className="text-sm text-blue-600 hover:underline" onClick={() => console.log("View all notifications")}>
          View all
        </button>
      </div>
      {/* Close on outside click can be handled in parent, but add a close button if needed */}
    </div>
  );
}

export default NotificationPopup;