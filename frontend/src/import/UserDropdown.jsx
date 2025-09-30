import React, { useState } from "react"; // unused useEffect
import styles from "./UserDropdown.module.css";

function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/"; // Reloads to reset state based on localStorage
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.trigger} onClick={toggleDropdown} aria-label="User menu">
        <img
          src={user?.profile_pic}
          alt="User profile"
          className={styles.avatar}
        />
        <span className={styles.name}>{user?.username}</span>
        <img
          src="../assets/images/img_dropdownoptionsiconuserlogin.svg"
          alt="Dropdown"
          className={styles.arrow}
        />
      </button>
      {isOpen && (
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <a href="#">Profile</a>
          </li>
          <li className={styles.menuItem}>
            <a href="#">Settings</a>
          </li>
          <li className={styles.menuItem}>
            <a onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</a> {/* Changed to <a> for styling consistency */}
          </li>
        </ul>
      )}
    </div>
  );
}

export default UserDropdown;