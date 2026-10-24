import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  MessageSquareText,
  PhoneCall,
  Instagram,
  X,
} from "lucide-react";
import { business } from "../../config";

export default function QuickAccessDock() {
  const [isOpen, setIsOpen] = useState(false);
  const dockRef = useRef(null);

  // Close dock on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const whatsappHref = `https://wa.me/${business.whatsapp.replace(/\D/g, "")}`;
  const instagramHref = business.instagramUrl || "https://www.instagram.com/sky.demac?psln=MTB3N3o0YzJlNnA5Yw%3D%3D&utm_source=qr";

  return (
    <div
      ref={dockRef}
      className={`quick-access-wrapper ${isOpen ? "is-expanded" : "is-collapsed"}`}
      aria-label="Quick contact & booking options"
    >
      {/* Expanded Menu Options */}
      <aside
        className={`quick-access-dock ${isOpen ? "is-open" : "is-hidden"}`}
        aria-hidden={!isOpen}
      >
        <div className="quick-access-header">
          <span className="quick-access-title">QUICK CONNECT</span>
          <span className="quick-access-pill">INSTANT ASSIST</span>
        </div>

        {/* 1. WhatsApp Action */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="quick-access-item quick-access-whatsapp"
          onClick={() => setIsOpen(false)}
        >
          <div className="quick-access-icon whatsapp-icon-bg">
            <MessageCircle size={19} />
          </div>
          <div className="quick-access-text">
            <strong>WhatsApp Care</strong>
            <small>7598111621</small>
          </div>
        </a>

        {/* 2. Direct Phone Call Action (Shows both 7598111621 & 7598111622) */}
        <div className="quick-access-item quick-access-phone-group">
          <div className="quick-access-icon phone-icon-bg">
            <PhoneCall size={19} />
          </div>
          <div className="quick-access-text">
            <strong>Call Workshop</strong>
            <div className="quick-phone-links">
              <a href="tel:7598111621" onClick={() => setIsOpen(false)}>
                7598111621
              </a>
              <span className="phone-separator">/</span>
              <a href="tel:7598111622" onClick={() => setIsOpen(false)}>
                7598111622
              </a>
            </div>
          </div>
        </div>

        {/* 3. Enquiry Form Action */}
        <Link
          to="/book-service"
          className="quick-access-item quick-access-enquiry"
          onClick={() => setIsOpen(false)}
        >
          <div className="quick-access-icon enquiry-icon-bg">
            <MessageSquareText size={19} />
          </div>
          <div className="quick-access-text">
            <strong>Enquiry Form</strong>
            <small>Book service & quotes</small>
          </div>
        </Link>

        {/* 4. Instagram Profile Action */}
        <a
          href={instagramHref}
          target="_blank"
          rel="noreferrer"
          className="quick-access-item quick-access-instagram"
          onClick={() => setIsOpen(false)}
        >
          <div className="quick-access-icon instagram-icon-bg">
            <Instagram size={19} />
          </div>
          <div className="quick-access-text">
            <strong>Instagram</strong>
            <small>@sky.demac</small>
          </div>
        </a>
      </aside>

      {/* Floating Trigger Button (Closed by default) */}
      <button
        type="button"
        className={`quick-access-trigger ${isOpen ? "is-active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close quick contact menu" : "Open quick contact menu"}
        title={isOpen ? "Close Quick Access" : "Quick Contact & Assist"}
      >
        <span className="trigger-icon-wrap" aria-hidden="true">
          {isOpen ? <X size={22} className="trigger-close" /> : <PhoneCall size={20} className="trigger-open" />}
        </span>
        <span className="trigger-label">
          {isOpen ? "Close" : "Quick Access"}
        </span>
        {!isOpen && <span className="trigger-pulse-dot" aria-hidden="true" />}
      </button>
    </div>
  );
}
