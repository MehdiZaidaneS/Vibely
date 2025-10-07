// src/pages/EventPage.jsx
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "../import/Sidebar";
import Modal from "../import/JoinEvent";
import Toast from "../import/NotificationJoin";
import CreateEventModal from "../import/CreateEventModal";
import UserDropdown from "../import/UserDropdown";
import "./EventPage.css";

function EventPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("recommended");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
  const createEvent = async (newEventData) => {
    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const savedEvent = await response.json();

      setEvents((prev) => [...prev, savedEvent]);

      setIsCreateModalOpen(false);
      setToast({ visible: true, message: "Event created successfully!" });
    } catch (error) {
      console.error(error);
      setToast({ visible: true, message: "Error creating event!" });
    }
  };


  // mock events
const [events, setEvents] = useState([
    {
      id: "freshers",
      title: "Freshers' Welcome Party",
      description:
        "Location: Helsinki Student Union Hall\nCapacity: 120 people\nDescription: Meet new friends, enjoy music, snacks, and games.",
      time: "Date & Time: 7 Oct, 7:00 PM – 11:30 PM",
      image: "../assets/images/img_main_admin_spon.png",
      className: "event-large",
      background: "url('../assets/images/img_mainadminsponsoredeventimage.png')",
    },
    {
      id: "football",
      title: "Weekend Football Match",
      description: "Töölönlahden Football Field\n15/22 players",
      time: "3:00 PM – 6:00 PM",
      image: "../assets/images/img_football_event.png",
      className: "event-medium",
      background: "url('../assets/images/img_footballmatch_event_image.png')",
    },
    {
      id: "gaming",
      title: "LAN Gaming Session",
      description:
        "Metropolia IT Lab, Room B203\n27/30 players\nDescription: Multiplayer gaming night — Valorant, FIFA, CS2, and more. PCs provided.",
      time: "5:00 PM – 12AM",
      image: "../assets/images/img_gaming_event_host_group.png",
      className: "event-medium",
      background: "url('../assets/images/img_gaming_event_image.png')",
    },
    {
      id: "photography",
      title: "Photography Walk",
      description:
        "Location: Senate Square, Helsinki\nCapacity: 20 people\nDescription: Capture the city's architecture, lights, and vibes with fellow photographers.",
      time: "3:00 PM – 6:00 PM",
      image: "../assets/images/img_football_event.png",
      className: "event-medium photography-event",
      background: "url('../assets/images/img_photography_event_image.png')",
    },
  ]);

  const filteredEvents = events.filter((event) => {
    const titleLower = event.title.toLowerCase();
    const descLower = event.description.toLowerCase();
    return titleLower.includes(searchTerm) || descLower.includes(searchTerm) || searchTerm === "";
  });

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
  const handleJoinClick = (title) => {
    setSelectedEvent(title);
    setIsModalOpen(true);
  };

  const confirmJoin = () => {
    setIsModalOpen(false);
    setToast({ visible: true, message: `You've joined "${selectedEvent}"` });
    setSelectedEvent(null);
  };

  const cancelJoin = () => {
    setIsModalOpen(false);
  };

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
            <div className="icon-container">
              <span className="tooltip-wrapper">
                <img src="../assets/images/img_notification.svg" alt="Notifications" className="notification-icon" />
                <span className="tooltip">Notifications</span>
              </span>
              <span className="tooltip-wrapper">
                <img src="../assets/images/img_DM_icon.svg" alt="Direct Messages" className="dm-icon" width="18" height="18" />
                <span className="tooltip">Direct Messages</span>
              </span>
            </div>
            <UserDropdown />
          </div>

          <div className="header-bottom">
            <h1 className="page-title">All Events</h1>

            <nav className="header-menu">
              <a
                href="#"
                className={`header-menu-item ${activeMenu === "recommended" ? "active" : ""}`}
                onClick={() => setActiveMenu("recommended")}
              >
                Recommended
              </a>
              <a
                href="#"
                className={`header-menu-item ${activeMenu === "ongoing" ? "active" : ""}`}
                onClick={() => setActiveMenu("ongoing")}
              >
                Ongoing
              </a>
              <button
                className="header-menu-item create-event-button"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create your own event
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                className={`event-card ${event.className} animate-card`}
                style={{ backgroundImage: event.background, backgroundSize: "cover", backgroundPosition: "center" }}
                
              >
                <div>
                  <h2 className="event-title">{event.title}</h2>
                  <p className="event-description">{event.description}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <button
                    className="join-button"
                    aria-label={`Join ${event.title.toLowerCase()}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinClick(event.title);
                    }}
                  >
                    <img src="../assets/images/img_join_football_event_button.svg" alt="Join" width="20" height="20" />
                  </button>
                  <p className="event-time">{event.time}</p>
                </div>
                <img src={event.image} alt="Event host" className="event-host" />
              </article>
            ))}
          </div>
        </main>
      </div>


      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createEvent}
      />


      {/* Modal + Toast */}
      < Modal
        isOpen={isModalOpen}
        title="Join event?"
        message={selectedEvent ? `Do you want to join "${selectedEvent}"?` : "Do you want to join this event?"
        }
        onConfirm={confirmJoin}
        onCancel={cancelJoin}
      />
      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} />
    </div >
  );
}

export default EventPage;
