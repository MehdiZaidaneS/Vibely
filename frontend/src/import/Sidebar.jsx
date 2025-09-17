// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar({ isOpen, onClose, onToggle }) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`} aria-hidden={!isOpen}>
        <img
          src="../assets/images/img_sidebar_logo.png"
          alt="Vibely Logo"
          className="sidebar-logo animate-logo"
        />

        <div className="ai-recommended-badge">
          <span className="ai-recommended-text">AI recommended events</span>
        </div>

        <nav className="sidebar-menu">
          <a href="#" className="menu-item">
            <span className="menu-text">Profile</span>
          </a>
          <a href="#" className="menu-item">
            <img src="../assets/images/img_vector.svg" alt="" width="16" height="18" />
            <span className="menu-text">All events</span>
          </a>
          <a href="#" className="menu-item">
            <img src="../assets/images/img_vector.svg" alt="" width="16" height="18" />
            <span className="menu-text">Friends</span>
          </a>
          <a href="#" className="menu-item">
            <img src="../assets/images/img_profile.svg" alt="" width="16" height="20" />
            <span className="menu-text">Public chat</span>
          </a>
          <a href="#" className="menu-item">
            <img src="../assets/images/img_vector_indigo_a100.svg" alt="" width="14" height="16" />
            <span className="menu-text">Direct messages</span>
          </a>
          <a href="#" className="menu-item">
            <img src="../assets/images/img_duofinder_icon.svg" alt="" width="24" height="24" />
            <span className="menu-text">DuoFinder</span>
          </a>
          <a href="#" className="menu-item">
            <img src="../assets/images/img_icon_settings.svg" alt="" width="16" height="20" />
            <span className="menu-text">Settings</span>
          </a>
        </nav>

        <div className="upgrade-section">
          <img
            src="../assets/images/img_duofinder_icon_folder_back.svg"
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
