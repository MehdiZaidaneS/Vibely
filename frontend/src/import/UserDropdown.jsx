import React, { useState } from "react";
import styles from "./UserDropdown.module.css";

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.trigger} onClick={toggleDropdown} aria-label="User menu">
        <img
          src="../assets/images/img_image_of_userlogin.png"
          alt="User profile"
          className={styles.avatar}
        />
        <span className={styles.name}>John Doe</span>
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
        </ul>
      )}
    </div>
  );
}

export default UserDropdown;