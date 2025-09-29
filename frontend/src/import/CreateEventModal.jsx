//src/import/CreateEventModal.jsx
import React, { useState } from "react";
import styles from "./CreateEvent.module.css";
import { createEvent } from "../api/eventsApi";

function CreateEventModal({ isOpen, onClose, setEvents, setIsCreateModalOpen, setToast }) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEventData ={
      author: localStorage.getItem("userId"),
      title,
      description,
      type: eventType,
      date,
      time,
      location,
    }

    createEvent(newEventData, setEvents, setIsCreateModalOpen, setToast)

    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    // Reset form
    setTitle("");
    setEventType("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <h2 className={styles.title}>Create New Event</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="event-title">Event Title*</label>
            <input
              id="event-title"
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 300))}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event-type">Event Type</label>
            <select
              id="event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className={styles.select}
            >
              <option value="">Select a type</option>
              <option>Social Event</option>
              <option>Business Event</option>
              <option>Educational Event</option>
              <option>Entertainment Event</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="event-date">Date</label>
              <input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="event-time">Time</label>
              <input
                id="event-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event-location">Location</label>
            <input
              id="event-location"
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event-description">Description</label>
            <textarea
              id="event-description"
              placeholder="Describe your event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            ></textarea>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventModal;