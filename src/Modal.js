import React, { useEffect } from "react";
import ReactDom from "react-dom";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  backgroundColor: "white",
  transform: "translate(-50%, -50%)",
  zIndex: 9999,
  height: "90%",
  width: "90%",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  overflow: "auto",
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  zIndex: 9999,
};

export default function Modal({ children, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    // Restore body scroll when modal closes
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        {children}
      </div>
    </>,
    document.getElementById("cart-root")
  );
}
