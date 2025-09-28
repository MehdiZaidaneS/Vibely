// src/import/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, onClose, onToggle }) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`} aria-hidden={!isOpen}>
        <img
          src="../assets/images/img_sidebar_logo.png"
          alt="Vibely Logo"
          className="sidebar-logo animate-logo"
        />

        <nav className="sidebar-menu">
          <Link to="/events" className="menu-item">
            <img src="../assets/images/img_Events_icon.svg" alt="" width="18" height="18" />
            <span className="menu-text">Events</span>
          </Link>
          <a href="#" className="menu-item">
            <img src="../assets/images/img_people.svg" alt="" width="18" height="20" />
            <span className="menu-text">People</span>
          </a>
            <Link to="/public-chat" className="menu-item">
            <img src="../assets/images/img_PublicChat_Icon.svg" alt="" width="25" height="20" />
            <span className="menu-text">Public Chat</span>
          </Link>
          <a href="#" className="menu-item">
            <img src="../assets/images/img_duofinder_icon.svg" alt="" width="24" height="24" />
            <span className="menu-text">DuoFinder</span>
          </a>
        </nav>

        <div className="upgrade-section">
          <img
            src="../assets/images/img_DuoFinder_Icon_group.svg"
            alt="Upgrade to DuoFinder"
            className="upgrade-icon"
          />
          <p className="upgrade-text">Upgrade to DuoFinder to grow your network</p>
          <button className="upgrade-button">Upgrade</button>
        </div>
      </aside>

      {/* Desktop chevron toggle - visible on wider screens */}
      <button
        className={`sidebar-toggle ${isOpen ? "open" : "closed"}`}
        onClick={onToggle}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        title={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? "‹" : "›"}
      </button>
    </>
  );
}
