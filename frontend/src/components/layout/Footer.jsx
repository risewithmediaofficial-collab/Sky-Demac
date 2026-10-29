import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Sparkles,
} from "lucide-react";
import { business } from "../../config";
import Wordmark from "../common/Wordmark";

/**
 * Global Site Footer
 */
export default function Footer() {
  const [year] = useState(() => new Date().getFullYear());

  const scrollToTop = (e) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <Link to="/" className="brand footer-brand" aria-label="SKY DEMAC home">
            <Wordmark variant="footer" />
          </Link>
          <p>
            Complete Automotive Care. Premium Detailing.
            <br />
            Professional Maintenance.
          </p>
          <a className="back-top" href="#top" onClick={scrollToTop}>
            Back to top <ArrowUpRight size={17} />
          </a>
        </div>

        {/* Prominent Footer Workshop Contact & Location Grid */}
        <div className="footer-contact-grid">
          {/* 1. Workshop Location */}
          <div className="footer-contact-block">
            <div className="footer-block-header">
              <span className="footer-block-icon">
                <MapPin size={18} />
              </span>
              <h4>Workshop Location</h4>
            </div>
            <p className="footer-address-text">{business.address}</p>
            <a
              href={business.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-map-action"
            >
              Open in Google Maps <ArrowUpRight size={14} />
            </a>
          </div>

          {/* 2. Direct Phone Lines */}
          <div className="footer-contact-block">
            <div className="footer-block-header">
              <span className="footer-block-icon">
                <Phone size={18} />
              </span>
              <h4>Phone Contacts</h4>
            </div>
            <div className="footer-phone-list">
              <a href={`tel:${business.phone}`} className="footer-phone-row">
                <span className="phone-tag">Line 1:</span>
                <strong>{business.phone}</strong>
              </a>
              <a href={`tel:${business.phoneSecondary}`} className="footer-phone-row">
                <span className="phone-tag">Line 2:</span>
                <strong>{business.phoneSecondary}</strong>
              </a>
            </div>
          </div>

          {/* 3. WhatsApp & Socials */}
          <div className="footer-contact-block">
            <div className="footer-block-header">
              <span className="footer-block-icon">
                <Sparkles size={18} />
              </span>
              <h4>Direct Assist & Social</h4>
            </div>
            <div className="footer-channels-list">
              <a
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="footer-channel-row whatsapp-channel"
              >
                <MessageCircle size={16} />
                <span>
                  WhatsApp: <strong>{business.whatsapp}</strong>
                </span>
                <ArrowUpRight size={13} />
              </a>

              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="footer-channel-row instagram-channel"
              >
                <Instagram size={16} />
                <span>
                  Instagram: <strong>@sky.demac</strong>
                </span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Suggested Directory Links */}
        <nav className="footer-menu" aria-label="Suggested website directory">
          {business.serviceMenu.map((item) => (
            <Link key={item.label} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer Meta & Socials */}
        <div className="footer-bottom">
          <span>© {year} SKY DEMAC AUTOMOTIVE</span>
          <span className="footer-credit">
            Developed by{" "}
            <a
              href="https://risewithmedia.com"
              target="_blank"
              rel="noreferrer"
              className="footer-credit-link"
            >
              risewithmedia.com
              <ArrowUpRight size={11} />
            </a>
          </span>
          <div>
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-bottom-social"
            >
              <Instagram size={14} /> Instagram
              <ArrowUpRight size={12} />
            </a>
            <a
              href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="footer-bottom-social"
            >
              <MessageCircle size={14} /> WhatsApp
              <ArrowUpRight size={12} />
            </a>
            <a
              href={business.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-bottom-social"
            >
              <MapPin size={14} /> Google Maps
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
