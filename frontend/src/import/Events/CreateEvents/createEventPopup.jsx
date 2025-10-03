// src/import/CreateEventModal.jsx
import React, { useState } from "react";
import styles from "./CreateEvent.module.css";
import { createEvent } from "../api/eventsApi";

function CreateEventModal({ isOpen, onClose, setEvents, setIsCreateModalOpen, setToast }) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [detailedLocation, setDetailedLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    const formData = new FormData();
    formData.append("author", localStorage.getItem("userId"));
    formData.append("title", title);
    formData.append("description", description);

    if (eventType) formData.append("type", eventType);
    if (date) formData.append("date", date);
    if (time) formData.append("time", time);
    if (endTime) formData.append("endTime", endTime);

    // Combine location fields into a single location string
    const locationParts = [city, address, detailedLocation].filter(part => part.trim());
    if (locationParts.length > 0) {
      formData.append("location", locationParts.join(", "));
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    createEvent(formData, setEvents, setIsCreateModalOpen, setToast)
    // Reset form
    setTitle("");
    setEventType("");
    setDate("");
    setTime("");
    setEndTime("");
    setCity("");
    setAddress("");
    setDetailedLocation("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    onClose(); // Close modal after submit
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
            <label htmlFor="event-type">Event Type*</label>
            <select
              id="event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className={styles.select}
              required
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
              <label htmlFor="event-date">Date*</label>
              <input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="event-time">Start Time*</label>
              <input
                id="event-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="event-end-time">End Time*</label>
              <input
                id="event-end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event-city">City*</label>
            <select
              id="event-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={styles.select}
              required
            >
              <option value="">Select a city</option>
              <option>Helsinki</option>
              <option>Espoo</option>
              <option>Tampere</option>
              <option>Vantaa</option>
              <option>Oulu</option>
              <option>Turku</option>
              <option>Jyväskylä</option>
              <option>Lahti</option>
              <option>Kuopio</option>
              <option>Pori</option>
              <option>Kouvola</option>
              <option>Joensuu</option>
              <option>Lappeenranta</option>
              <option>Vaasa</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event-address">Address*</label>
            <input
              id="event-address"
              type="text"
              placeholder="e.g., Mannerheimintie 1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event-detailed-location">Detailed Location (optional)</label>
            <input
              id="event-detailed-location"
              type="text"
              placeholder="e.g., Building A, 3rd floor, Room 301"
              value={detailedLocation}
              onChange={(e) => setDetailedLocation(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event-description">Description*</label>
            <textarea
              id="event-description"
              placeholder="Describe your event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              required
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event-image">Event Image (optional)</label>
            <div className={styles.imageUploadContainer}>
              {imagePreview ? (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Event preview" className={styles.previewImage} />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={removeImage}
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <label htmlFor="event-image" className={styles.uploadLabel}>
                  <div className={styles.uploadContent}>
                    <span className={styles.uploadIcon}>📷</span>
                    <span className={styles.uploadText}>Click to upload image</span>
                  </div>
                </label>
              )}
              <input
                id="event-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </div>
            <small className={styles.helpText}>Leave empty to use category-based gradient background</small>
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