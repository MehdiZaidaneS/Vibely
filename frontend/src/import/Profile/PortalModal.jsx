// src/import/PortalModal.jsx
import { createPortal } from 'react-dom';

const PortalModal = ({ children }) => {
  return createPortal(
    children,
    document.body // Render directly to body
  );
};

export default PortalModal;