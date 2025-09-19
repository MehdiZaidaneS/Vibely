import React, { useState, useEffect } from "react";
import Sidebar from "../import/Sidebar";
import { useNavigate } from "react-router-dom";
import styles from "./CreateEvent.module.css";

function CreateEvent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Sidebar handlers (i just reused it from EventPage (consistency ig)
  const openSidebar = () => {
    setIsSidebarOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    document.body.style.overflow = "auto";
  };
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "auto";
      return next;
    });
  };

  // Tab switching
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Form validation (simple, on submit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    alert("Event created successfully!");
    // TODO: Add actual submit logic (e.g., API call)
  };

  // Toolbar insertion (simple Markdown-like)
  const insertTextAtCursor = (before, after) => {
    const textarea = document.querySelector(`.${styles["body-text-area"]}`);
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = body;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setBody(newText);
    textarea.focus();
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
  };

  // Handle toolbar clicks
  const handleToolbarClick = (type) => {
    if (type === "Bold") {
      insertTextAtCursor("**", "**");
    } else if (type === "Italic") {
      insertTextAtCursor("*", "*");
    } else if (type === "Link") {
      insertTextAtCursor("[", "](url)");
    }
    // TODO: Add more toolbar functions as needed
  };

  // Character limit for title (300 max)
  const handleTitleChange = (e) => {
    const maxLength = 300;
    setTitle(e.target.value.slice(0, maxLength));
  };

  // Escape key handler (for sidebar)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        closeSidebar();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (window.innerWidth <= 1023 && isSidebarOpen) {
        const sidebar = document.querySelector(`.${styles.sidebar}`);
        const hamburger = document.querySelector(`.${styles.hamburger}`);
        if (sidebar && hamburger && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
          closeSidebar();
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isSidebarOpen]);

  return (
    <div className={`${styles["main-container"]} ${isSidebarOpen ? styles["sidebar-open"] : ""}`}>
      {/* overlay (used for mobile) */}
      <div
        className={`${styles["sidebar-overlay"]} ${isSidebarOpen ? styles.active : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />

      <div className={styles["content-wrapper"]}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles["header-top"]}>
            <button className={styles.hamburger} id="hamburger" onClick={openSidebar}>
              ☰
            </button>

            {/* Note: Search, notifications, and user profile can be added here if needed, copied from EventPage */}
          </div>
        </header>

        {/* Main Content (converted from HTML) */}
        <main className={styles["main-content"]}>
          <div className={styles["content-wrapper"]}>
            <header className={styles["header-section"]}>
              <h1 className={styles["page-title"]}>Create event</h1>
              <span className={styles["drafts-link"]}>Drafts</span>
            </header>

            <select className={styles["event-type-dropdown"]} aria-label="Select event type">
              <option>Select a type of event ▼</option>
              <option>Social Event</option>
              <option>Business Event</option>
              <option>Educational Event</option>
              <option>Entertainment Event</option>
            </select>

            <section className={styles["tabs-section"]}>
              <div className={styles["tab-item"]}>
                <span
                  className={`${styles["tab-text"]} ${activeTab !== "Text" ? styles.inactive : ""}`}
                  onClick={() => handleTabClick("Text")}
                >
                  Text
                </span>
                <div className={styles["tab-line"]} style={{ backgroundColor: activeTab === "Text" ? "#0079d3" : "transparent" }}></div>
              </div>
              <div className={styles["tab-content"]}>
                <span
                  className={`${styles["tab-text"]} ${activeTab !== "Images & Video" ? styles.inactive : ""}`}
                  onClick={() => handleTabClick("Images & Video")}
                >
                  Images & Video
                </span>
                <span
                  className={`${styles["tab-text"]} ${activeTab !== "Link" ? styles.inactive : ""}`}
                  onClick={() => handleTabClick("Link")}
                >
                  Link
                </span>
              </div>
            </section>

            <form className={styles["form-section"]} onSubmit={handleSubmit}>
              <input
                type="text"
                className={styles["title-input"]}
                placeholder="Title*"
                required
                aria-label="Event title"
                value={title}
                onChange={handleTitleChange}
              />

              <div className={styles["date-time-location"]}>
                <div className={styles["date-time-group"]}>
                  <input type="date" className={styles["date-input"]} placeholder="Date" aria-label="Event date" />
                  <input type="time" className={styles["time-input"]} placeholder="Time" aria-label="Event time" />
                </div>
                <input type="text" className={styles["location-input"]} placeholder="Location" aria-label="Event location" />
              </div>

              <button type="button" className={styles["add-tags-button"]}>Add tags</button>

              <textarea
                className={styles["body-text-area"]}
                placeholder="Body text (optional)"
                aria-label="Event description"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>

              <div className={styles["editor-toolbar"]}>
                <button type="button" className={styles["toolbar-button"]} title="Bold" onClick={() => handleToolbarClick("Bold")}><strong>B</strong></button>
                <button type="button" className={styles["toolbar-button"]} title="Italic" onClick={() => handleToolbarClick("Italic")}><em>I</em></button>
                <button type="button" className={styles["toolbar-button"]} title="Strikethrough"><s>S</s></button>
                <button type="button" className={styles["toolbar-button"]} title="Superscript">x²</button>
                <button type="button" className={styles["toolbar-button"]} title="Text">T</button>
                <button type="button" className={styles["toolbar-button"]} title="Link" onClick={() => handleToolbarClick("Link")}>🔗</button>
                <button type="button" className={styles["toolbar-button"]} title="Image">🖼️</button>
                <button type="button" className={styles["toolbar-button"]} title="Video">▶️</button>
                <button type="button" className={styles["toolbar-button"]} title="Bullet List">•</button>
                <button type="button" className={styles["toolbar-button"]} title="Numbered List">1.</button>
                <button type="button" className={styles["toolbar-button"]} title="Quote">❝</button>
                <button type="button" className={styles["toolbar-button"]} title="Code">&lt;/&gt;</button>
                <span className={styles["markdown-switch"]}>Switch to Markdown Editor</span>
              </div>
            </form>

            <div className={styles["action-buttons"]}>
              <button type="button" className={styles["save-draft-button"]}>Save Draft</button>
              <button type="button" className={styles["post-button"]} onClick={handleSubmit}>Post</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateEvent;