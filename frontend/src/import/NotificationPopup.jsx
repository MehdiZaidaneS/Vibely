import React, { useEffect, useState } from "react";
import { getMyNotifications, deleteNotification } from "../api/notificationsApi";
import { declineFriendRequest, acceptFriendResquest } from "../api/userApi";

function NotificationPopup({ onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getMyNotifications(setNotifications);
  }, []);

  const handleAccept = async (notif) => {
    await acceptFriendResquest(notif.sender)
    await deleteNotification(notif._id)

  };

  const handleDecline = async (notif) => {
    await declineFriendRequest(notif.sender)
    await deleteNotification(notif._id)

  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>
      <ul className="max-h-[320px] overflow-y-auto"> {/* 5 items * 64px = 320px */}
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-center ${notif.unread ? "bg-blue-50" : ""}`}
              onClick={() => console.log("Notification clicked:", notif.content)}
            >
              <span className="text-sm text-gray-800">{notif.content}</span>

              <div className="flex space-x-2">
                {notif.type === "Message" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                  >
                    Remove
                  </button>
                )}

                {notif.type === "Friend Request" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(notif);
                      }}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecline(notif);
                      }}
                      className="px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">No notifications</li>
        )}
      </ul>

    </div>
  );
}

export default NotificationPopup;
