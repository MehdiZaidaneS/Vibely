// src/pages/EventPage.jsx
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "../import/Sidebar";
import Modal from "../import/JoinEvent";
import { getUserbyId } from "../api/userApi";
import { joinEvent, getAllEvents, getJoinedEvents, leaveEvent } from "../api/eventsApi";
import Toast from "../import/NotificationJoin";
import CreateEventModal from "../import/createEventPopup";
import UserDropdown from "../import/UserDropdown";
import NotificationPopup from "../import/NotificationPopup"; 
import DmPopup from "../import/DmPopup"; 
import { Plus } from 'lucide-react';
import "./EventPage.css";

function EventPage({isAuthenticated}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDmOpen, setIsDmOpen] = useState(false); 

  useEffect(() => {
    getAllEvents(setEvents, setActiveMenu)

    if (isAuthenticated) {
      getUserbyId(setUser)
    }
  }, []);


  // Sidebar handlers
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

  // join flow
  const handleJoinLeaveClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const cancelJoin = () => {
    setIsModalOpen(false);
    setSelectedEvent(null)
  };

  // Joining events
  const confirmJoinLeave = async () => {
    if (activeMenu === "Joined Events") {
      await leaveEvent(selectedEvent, setIsCreateModalOpen, setSelectedEvent, setToast)
      await getJoinedEvents(setEvents, setActiveMenu)
    } else {
      await joinEvent(selectedEvent, setIsCreateModalOpen, setSelectedEvent, setToast)
    }

    setIsModalOpen(false)
  }



  const closeToast = () => setToast({ ...toast, visible: false });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isModalOpen) setIsModalOpen(false);
        if (isSidebarOpen) closeSidebar();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isSidebarOpen]);

  return (
    <div className={`main-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* overlay (used for mobile) */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />

      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-top">
            <button className="hamburger" id="hamburger" onClick={openSidebar}>
              ☰
            </button>

            <div className="search-container">
              <img src="../assets/images/img_group_19.svg" alt="Search" className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search"
                aria-label="Search events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>
            <div className="right-group">
              {isAuthenticated ? (
                <>
                  <span className="tooltip-wrapper">
                    <Plus className="create-icon" onClick={() => setIsCreateModalOpen(true)} />
                    <span className="tooltip">Create Event</span>
                  </span>
                  <div className="icon-container">
                    <span className="tooltip-wrapper relative"> {/* Added relative for popup positioning */}
                      <img 
                        src="../assets/images/img_notification.svg" 
                        alt="Notifications" 
                        className="notification-icon cursor-pointer" 
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)} // Toggle popup
                      />
                      <span className="tooltip">Notifications</span>
                      {isNotificationOpen && <NotificationPopup onClose={() => setIsNotificationOpen(false)} />} {/* Render popup */}
                    </span>
                    <span className="tooltip-wrapper relative"> {/* Added relative for popup positioning */}
                      <img 
                        src="../assets/images/img_DM_icon.svg" 
                        alt="Direct Messages" 
                        className="dm-icon cursor-pointer" 
                        width="18" 
                        height="18" 
                        onClick={() => setIsDmOpen(!isDmOpen)} // Toggle popup
                      />
                      <span className="tooltip">Direct Messages</span>
                      {isDmOpen && <DmPopup onClose={() => setIsDmOpen(false)} />} {/* Render popup */}
                    </span>
                  </div>
                  <UserDropdown user={user} />
                </>
              ) : (
                <>
                  <Link to="/login" className="auth-button">Log In</Link>
                  <Link to="/register" className="auth-button">Register</Link>
                </>
              )}
            </div>
          </div>

          <div className="header-bottom">
            <h1 className="page-title">{activeMenu}</h1>

            <nav className="header-menu">
              <a
                className={`header-menu-item ${activeMenu === "All Events" ? "active" : ""}`}
                onClick={() => getAllEvents(setEvents, setActiveMenu)}
              >
                All Events
              </a>
              <a
                className={`header-menu-item ${activeMenu === "Recommended" ? "active" : ""}`}
                onClick={() => setActiveMenu("Recommended")}
              >
                Recommended
              </a>
              <a
                className={`header-menu-item ${activeMenu === "Joined Events" ? "active" : ""}`}
                onClick={() => getJoinedEvents(setEvents, setActiveMenu)}
              >
                Joined
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="events-grid">
            {events.map((event) => (
              <article
                key={event._id}
                className={`event-card ${event.className} animate-card`}
                style={{ backgroundImage: event.background, backgroundSize: "cover", backgroundPosition: "center" }}
                onClick={() => console.log("Event card clicked:", event.title)}
              >
                <div>
                  <h2 className="event-title">{event.title}</h2>
                  <p className="event-description">{event.description}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <button
                    className={`join-button ${activeMenu === "Joined Events" ? "leave-style" : ""}`}
                    aria-label={
                      activeMenu === "Joined Events"
                        ? `Leave ${event.title.toLowerCase()}`
                        : `Join ${event.title.toLowerCase()}`
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeMenu === "Joined Events") {
                        handleJoinLeaveClick(event);
                      } else {
                        handleJoinLeaveClick(event);
                      }
                    }}
                  >
                    <img
                      src={
                        activeMenu === "Joined Events"
                          ? "../assets/images/img_join_football_event_button.svg" // icon for leaving
                          : "../assets/images/img_join_football_event_button.svg" // icon for joining
                      }
                      alt={activeMenu === "Joined Events" ? "Leave" : "Join"}
                      width="20"
                      height="20"
                    />
                  </button>
                  <p className="event-time">{event.time}</p>
                </div>
                <img src={event.host?.profile_pic} alt="Event host" className="event-host" /> {/* Fixed to use event.host */}
              </article>
            ))}
          </div>
        </main>
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        setEvents={setEvents}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setToast={setToast}
      />

      <Modal
        isOpen={isModalOpen}
        title="Are you sure?"
        message={
          selectedEvent
            ? activeMenu === "Joined Events"
              ? `Do you want to leave "${selectedEvent.title}"?`
              : `Do you want to join "${selectedEvent.title}"?`
            : "Loading..."
        }
        onConfirm={confirmJoinLeave}
        onCancel={cancelJoin}
        activeMenu={activeMenu}
      />
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} />
    </div>
  );
}

export default EventPage;