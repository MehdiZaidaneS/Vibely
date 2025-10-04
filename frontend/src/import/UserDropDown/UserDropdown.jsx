// src/import/UserDropdown.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePopupFull from "../Profile/ProfilePopupFull"; 
import ProfilePopupMinimal from "../Profile/ProfilePopupMinimal";

import styles from "./UserDropdown.module.css";

function UserDropdown({ user, setUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  const handleProfileClick = () => {
    setIsProfilePopupOpen(true); // Open popup instead of navigating
    setIsOpen(false); // Close dropdown
  };

  const handleExpandToFullProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <div className={styles.dropdown}>
        <button className={styles.trigger} onClick={toggleDropdown} aria-label="User menu">
          <img
            src={user?.profile_pic || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
            alt="User profile"
            className={styles.avatar}
          />
          <span className={styles.name}>{user?.username || user?.name || "User"}</span>
          <img
            src="../assets/images/img_dropdownoptionsiconuserlogin.svg"
            alt="Dropdown"
            className={styles.arrow}
          />
        </button>
        {isOpen && (
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <a onClick={handleProfileClick} style={{ cursor: "pointer" }}>Profile</a>
            </li>
            <li className={styles.menuItem}>
              <a onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</a>
            </li>
          </ul>
        )}
      </div>

      {/* Profile Popup Modal */}
    {/* ProfilePopupFull or ProfilePopupMinimal */}  <ProfilePopupFull
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
        user={user}
        setUser={setUser}
        onExpand={handleExpandToFullProfile}
      />
    </>
  );
}

export default UserDropdown;