// src/import/Sidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, onClose, onToggle }) {
  const navigate = useNavigate();

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`} aria-hidden={!isOpen}>
        <div className="sidebar-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          {["V", "i", "b", "e", "l", "y"].map((letter, index) => (
            <span
              key={index}
              className="sidebar-logo-letter"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>

        <nav className="sidebar-menu">
          <Link to="/" className="menu-item">
            <img src="../assets/images/img_events_icon.svg" alt="" width="18" height="18" />
            <span className="menu-text">Events</span>
          </Link>
          <Link to="/people-page" className="menu-item">
            <img src="../assets/images/img_people.svg" alt="" width="18" height="20" />
            <span className="menu-text">People</span>
          </Link>
            <Link to="/public-chat" className="menu-item">
            <img src="../assets/images/img_publicchat_icon.svg" alt="" width="25" height="20" />
            <span className="menu-text">Public Chat</span>
          </Link>
          <Link to="/duo-finder" className="menu-item">
            <img src="../assets/images/img_duofinder_icon.svg" alt="" width="24" height="24" />
            <span className="menu-text">DuoFinder</span>
          </Link>
        </nav>
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
