// src/pages/EventPage.jsx
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "../import/Sidebar";
import Modal from "../import/Events/JoinEvent";
import { getUnreadPrivateChats, getUserbyId } from "../api/userApi";
import { joinEvent, getAllEvents, getJoinedEvents, leaveEvent, recommendEvents } from "../api/eventsApi";
import Toast from "../import/Notification/NotificationJoin";
import CreateEventModal from "../import/Events/CreateEvents/createEventPopup";
import UserDropdown from "../import/UserDropDown/UserDropdown";
import NotificationPopup from "../import/Notification/NotificationPopup";
import DmPopup from "../import/DmPopup";
import EventDetailsModal from "../import/Events/EventDetails/EventDetailsModal";
// import ProfileMiniPage from "../import/ProfileModal";
import { Plus } from 'lucide-react';
import "./EventPage.css";
import { getMyNotifications } from "../api/notificationsApi";

// Helper function to generate category-based gradient backgrounds or use image
const getEventBackground = (event) => {
  // If event already has a background, check if it's an image URL or gradient
  if (event.background) {
    // If it's an image URL (contains common image extensions or starts with http/https)
    if (event.background.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) ||
      event.background.startsWith('http://') ||
      event.background.startsWith('https://') ||
      event.background.startsWith('url(')) {
      return event.background;
    }
    // Otherwise it's already a gradient, return as-is
    return event.background;
  }

  // Check if event has an imageUrl or image property for custom images
  if (event.imageUrl || event.image) {
    const imageUrl = event.imageUrl || event.image;
    // If it's a relative path, prepend the backend URL
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
    return fullImageUrl;
  }

  // Extract event type
  const type = event.type?.toLowerCase() || '';

  // Match exact event types from the form
  if (type.includes('social')) {
    return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
  }

  if (type.includes('business')) {
    return 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)';
  }

  if (type.includes('educational') || type.includes('education')) {
    return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  }

  if (type.includes('entertainment')) {
    return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
  }

  // Default gradient (purple theme)
  return 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)';
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Helper function to extract city from location string
const extractCity = (locationString) => {
  if (!locationString) return '';
  // Assumes city is the first part before the first comma
  return locationString.split(',')[0].trim();
};

function EventPage({ isAuthenticated }) {
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const messages = await getUnreadPrivateChats();
        setConversations(messages || []);
      } catch (error) {
        console.error("Failed to load unread private chats:", error);
      }
    };
    fetchUnreadChats();
  }, []);

  useEffect(() => {
    getMyNotifications(setNotifications);
  }, []);
  useEffect(() => {
    getAllEvents(setEvents, setActiveMenu)

    if (isAuthenticated) {
      getUserbyId().then(userData => {
        setUser(userData);
      }).catch(err => {
        console.error("Error fetching user:", err);
      });
    }
  }, [isAuthenticated]);


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
      await getJoinedEvents(setEvents)
    } else {
      await joinEvent(selectedEvent, setIsCreateModalOpen, setSelectedEvent, setToast, setEvents)
    }

    setIsModalOpen(false)
  }

  // Handle event card click to show details
  const handleCardClick = (event) => {
    setDetailsEvent(event);
    setIsDetailsModalOpen(true);
  };

  // Handle join/leave from details modal
  const handleJoinLeaveFromModal = (event) => {
    setIsDetailsModalOpen(false);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeToast = () => setToast({ ...toast, visible: false });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isDetailsModalOpen) setIsDetailsModalOpen(false);
        if (isModalOpen) setIsModalOpen(false);
        if (isSidebarOpen) closeSidebar();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isSidebarOpen, isDetailsModalOpen]);

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

            <div className="search-filter-wrapper">
              {/* Search Bar */}
              <div className="search-container">
                <img
                  src="../assets/images/img_group_19.svg"
                  alt="Search"
                  className="search-icon"
                />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search events..."
                  aria-label="Search events"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                />
              </div>

              {/* Filters Below Search Bar */}
              <div className="filters-below">
                {/* Location Filter */}
                <select
                  className="filter-select"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {[...new Set(events.map(event => extractCity(event.location)).filter(Boolean))].map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                {/* Date Filter */}
                <input
                  type="date"
                  className="filter-date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>


            <div className="right-group">
              {isAuthenticated ? (
                <>
                  <span className="tooltip-wrapper">
                    <Plus className="create-icon" onClick={() => setIsCreateModalOpen(true)} />
                    <span className="tooltip">Create Event</span>
                  </span>
                  <div className="icon-container">
                    <span className="tooltip-wrapper relative">
                      <img
                        src="../assets/images/img_notification.svg"
                        alt="Notifications"
                        className="notification-icon cursor-pointer"
                        onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsDmOpen(false); }}
                      />
                      <span className="tooltip">Notifications</span>

                      {/* Red dot for unread notifications */}
                      {notifications.length > 0 && (
                        <span className="notification-dot"></span>
                      )}

                      {isNotificationOpen && <NotificationPopup notifications={notifications} setNotifications={setNotifications} onClose={() => setIsNotificationOpen(false)} />}
                    </span>

                    <span className="tooltip-wrapper relative">
                      <img
                        src="../assets/images/img_DM_icon.svg"
                        alt="Direct Messages"
                        className="dm-icon cursor-pointer"
                        width="18"
                        height="18"
                        onClick={() => { setIsDmOpen(!isDmOpen); setIsNotificationOpen(false) }}
                      />
                      <span className="tooltip">Direct Messages</span>

                      {/* Red dot for unread DMs */}
                      {conversations.length > 0 && (
                        <span className="dm-notification-dot"></span>
                      )}

                      {isDmOpen && <DmPopup conversations={conversations} setConversations={setConversations} onClose={() => setIsDmOpen(false)} />}
                    </span>

                  </div>
                  <UserDropdown user={user} setUser={setUser} setToast={setToast} />
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
              {isAuthenticated && (
                <>
                  <a
                    className={`header-menu-item ${activeMenu === "Recommended" ? "active" : ""}`}
                    onClick={async () => {
                      setIsLoadingRecommendations(true);
                      await recommendEvents(setActiveMenu, setEvents);
                      setIsLoadingRecommendations(false);
                    }}
                  >
                    Recommended
                  </a>
                  <a
                    className={`header-menu-item ${activeMenu === "Joined Events" ? "active" : ""}`}
                    onClick={() => {
                      getJoinedEvents(setEvents);
                      setActiveMenu("Joined Events");
                    }}
                  >
                    Joined
                  </a>

                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {isLoadingRecommendations ? (
            <div className="loading-recommendations">
              <div className="loading-cards-container">
                <div className="loading-card card-1"></div>
                <div className="loading-card card-2"></div>
                <div className="loading-card card-3"></div>
              </div>
              <h2 className="loading-text">Generating recommended events based on your interests!</h2>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3 className="empty-state-title">
                {activeMenu === "Joined Events"
                  ? "You haven't joined any events yet"
                  : activeMenu === "Recommended"
                    ? "No recommended events available"
                    : "No events available"}
              </h3>
              <p className="empty-state-description">
                {activeMenu === "Joined Events"
                  ? "Browse events and join the ones that interest you!"
                  : activeMenu === "Recommended"
                    ? "Complete your profile to get personalized recommendations"
                    : "Check back later for new events"}
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {events
                // Search filter
                .filter(event => {
                  if (!searchTerm.trim()) return true;
                  const title = event.title?.toLowerCase() || "";
                  const description = event.description?.toLowerCase() || "";
                  return title.includes(searchTerm) || description.includes(searchTerm);
                })

                // Location filter
                .filter(event => {
                  if (!selectedLocation) return true;
                  return extractCity(event.location)?.toLowerCase() === selectedLocation.toLowerCase();
                })

                // Date filter
                .filter(event => {
                  if (!selectedDate) return true;
                  const eventDate = new Date(event.date).toISOString().split('T')[0];
                  return eventDate === selectedDate;
                })

                // Remove expired events
                .filter(event => {
                  if (!event.date) return true;
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return eventDate >= today;
                })
                .map((event, index) => {
                  const cardBackground = getEventBackground(event);
                  const isImageUrl = !cardBackground.includes('gradient') && (
                    cardBackground.startsWith('url(') ||
                    cardBackground.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) ||
                    cardBackground.startsWith('http://') ||
                    cardBackground.startsWith('https://')
                  );

                  return (
                    <article
                      key={event._id}
                      className="event-card-modern animate-card"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleCardClick(event)}
                    >
                      {/* Event Image with Gradient Overlay */}
                      <div className="event-card-image-wrapper">
                        <div
                          className="event-card-background"
                          style={
                            isImageUrl
                              ? {
                                backgroundImage: cardBackground.startsWith('url(') ? cardBackground : `url('${cardBackground}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }
                              : {
                                background: cardBackground
                              }
                          }
                        >
                          <div className="event-card-overlay"></div>
                        </div>

                        {/* Host Avatar */}
                        {event.author?.profile_pic && (
                          <img
                            src={event.author.profile_pic}
                            alt="Event host"
                            className="event-card-host-avatar"
                          />
                        )}

                        {/* Match Score Badge for Recommended */}
                        {activeMenu === "Recommended" && event.matchScore && (
                          <div className="event-card-match-badge">
                            {event.matchScore}/100
                          </div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="event-card-content">
                        <div className="event-card-header">
                          <h2 className="event-card-title">{event.title}</h2>
                          <p className="event-card-description">{event.description}</p>
                          {event.author?.username && (
                            <p className="event-card-creator">
                              Created by <span className="event-card-creator-name">{event.author.username}</span>
                            </p>
                          )}
                        </div>

                        <div className="event-card-footer">
                          <div className="event-card-meta">
                            {event.date && (
                              <span className="event-card-date">{formatDate(event.date)}</span>
                            )}
                            {event.time && (
                              <span className="event-card-time">
                                🕒 {event.time}{event.endTime ? ` - ${event.endTime}` : ''}
                              </span>
                            )}
                            {event.location && (
                              <span className="event-card-location">
                                📍 {extractCity(event.location)}
                              </span>
                            )}
                            {event.participant && (
                              <span className="event-card-participants">
                                👥 {event.participant.length}{event.capacity ? `/${event.capacity}` : ''} {event.participant.length === 1 ? 'participant' : 'participants'}
                              </span>
                            )}
                          </div>

                          {!isAuthenticated ? (
                            <div className="event-card-login-message">
                              Log in to join event
                            </div>
                          ) : activeMenu === "Joined Events" ? (
                            <button
                              className="event-card-join-btn leave"
                              aria-label={`Leave ${event.title.toLowerCase()}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinLeaveClick(event);
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>✖️</span>
                              <span>Leave</span>
                            </button>
                          ) : event.participant?.some(p => (p._id || p) === user?._id) ? (
                            <div className="event-card-joined-badge">
                              ✓ Joined
                            </div>
                          ) : event.capacity && event.participant?.length >= event.capacity ? (
                            <div className="event-card-full-badge">
                              Full
                            </div>
                          ) : (
                            <button
                              className="event-card-join-btn"
                              aria-label={`Join ${event.title.toLowerCase()}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinLeaveClick(event);
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>➕</span>
                              <span>Join</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          )}
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

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={detailsEvent}
        onJoinLeave={handleJoinLeaveFromModal}
        isJoined={detailsEvent?.participant?.some(p => (p._id || p) === user?._id)}
        activeMenu={activeMenu}
        isAuthenticated={isAuthenticated}
      />

      <Toast message={toast.message} visible={toast.visible} onClose={closeToast} />
    </div>
  );
}

export default EventPage;