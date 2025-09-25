// src/import/Toast.jsx
import React, { useEffect } from "react";

export default function Toast({ message, visible, onClose, type = "success", duration = 3000 }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [visible, onClose, duration]);

  if (!visible) return null;

  return (
    <div className={`toast ${type === "success" ? "toast-success" : "toast-info"}`} role="status">
      {message}
      <button className="toast-close" aria-label="Close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
