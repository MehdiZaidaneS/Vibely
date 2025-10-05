import React, { useEffect, useState } from "react";
import {
  getMyNotifications,
  //deleteNotification,
} from "../../api/notificationsApi";
import {
  declineFriendRequest,
  acceptFriendResquest,
} from "../../api/userApi";
import { Check, X, Trash2 } from "lucide-react"; // if using lucide-react icons


function NotificationPopup({ onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getMyNotifications(setNotifications);
  }, []);

  const handleAccept = async (notif) => {
    try {
      await acceptFriendResquest(notif.sender);
      //await deleteNotification(notif._id);
      await getMyNotifications(setNotifications);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async (notif) => {
    try {
      await declineFriendRequest(notif.sender);
     // await deleteNotification(notif._id);
      await getMyNotifications(setNotifications);
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div
      className="absolute top-full right-0 mt-3 w-80 
      bg-white rounded-2xl shadow-xl border border-gray-200 
      animate-slideDownFade z-[1100]"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Notifications
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          ✕
        </button>
      </div>

      <ul className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-all 
              cursor-pointer flex justify-between items-center rounded-lg ${
                notif.unread ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                {notif.unread && (
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                )}
                <span className="text-sm text-gray-800">{notif.content}</span>
              </div>

              <div className="flex space-x-2">
                {notif.type === "Message" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                {notif.type === "Friend Request" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(notif);
                      }}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecline(notif);
                      }}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs rounded-md transition"
                    >
                     <X size={12} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-6 text-center text-gray-500 text-sm">
            No notifications yet
          </li>
        )}
      </ul>
    </div>
  );
}

export default NotificationPopup;
