import React from 'react';
import { X, Calendar, MapPin, Users, Clock } from 'lucide-react';
import './EventDetailsModal.css';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const EventDetailsModal = ({ isOpen, onClose, event, onJoinLeave, isJoined }) => {
  if (!isOpen || !event) return null;

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

  const cardBackground = getEventBackground(event);
  const isImageUrl = cardBackground.startsWith('url(') ||
                     cardBackground.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) ||
                     (cardBackground.startsWith('http://') || cardBackground.startsWith('https://'));
  const isGradient = !isImageUrl && cardBackground.includes('gradient');

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="event-modal-close" onClick={onClose} aria-label="Close modal">
          <X className="w-6 h-6" />
        </button>

        {/* Event Image/Background */}
        <div
          className="event-modal-header"
          style={{
            background: isImageUrl ? 'transparent' : (isGradient ? cardBackground : cardBackground),
            backgroundImage: isImageUrl ? (cardBackground.startsWith('url(') ? cardBackground : `url('${cardBackground}')`) : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="event-modal-overlay-gradient"></div>
          {isGradient && <div className="event-modal-pattern"></div>}

          {/* Host Avatar */}
          {event.author?.profile_pic && (
            <div className="event-modal-host-container">
              <img
                src={event.author.profile_pic}
                alt="Event host"
                className="event-modal-host-avatar"
              />
              <span className="event-modal-host-label">Host</span>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className="event-modal-content">
          {/* Title and Description */}
          <div className="event-modal-title-section">
            <h2 className="event-modal-title">{event.title}</h2>
            <p className="event-modal-description">{event.description}</p>
            {event.author?.username && (
              <p className="event-modal-creator">
                Created by <span className="event-modal-creator-name">{event.author.username}</span>
              </p>
            )}
          </div>

          {/* Event Details Grid */}
          <div className="event-modal-details-grid">
            {event.time && (
              <div className="event-modal-detail-item">
                <div className="event-modal-detail-icon">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="event-modal-detail-content">
                  <span className="event-modal-detail-label">Time</span>
                  <span className="event-modal-detail-value">
                    {event.time}{event.endTime ? ` - ${event.endTime}` : ''}
                  </span>
                </div>
              </div>
            )}

            {event.date && (
              <div className="event-modal-detail-item">
                <div className="event-modal-detail-icon">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="event-modal-detail-content">
                  <span className="event-modal-detail-label">Date</span>
                  <span className="event-modal-detail-value">{formatDate(event.date)}</span>
                </div>
              </div>
            )}

            {event.location && (
              <div className="event-modal-detail-item">
                <div className="event-modal-detail-icon">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="event-modal-detail-content">
                  <span className="event-modal-detail-label">Location</span>
                  <span className="event-modal-detail-value">{event.location}</span>
                </div>
              </div>
            )}

            {event.participant && (
              <div className="event-modal-detail-item">
                <div className="event-modal-detail-icon">
                  <Users className="w-5 h-5" />
                </div>
                <div className="event-modal-detail-content">
                  <span className="event-modal-detail-label">Participants</span>
                  <span className="event-modal-detail-value">
                    {event.participant.length} {event.participant.length === 1 ? 'person' : 'people'} joined
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Match Score (for recommended events) */}
          {event.matchScore && (
            <div className="event-modal-match-badge">
              <span className="event-modal-match-text">{event.matchScore}/100 match</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="event-modal-actions">
            <button
              className={`event-modal-join-button ${isJoined ? 'leave-style' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onJoinLeave(event);
              }}
            >
              {isJoined ? 'Leave Event' : 'Join Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;