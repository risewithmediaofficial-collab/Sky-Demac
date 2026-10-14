import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Plus,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { business, confirmedServices } from "../../config";
import SafeImage from "../common/SafeImage";

/**
 * Service modal dialog for care guides
 */
function ServiceDialog({ category, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    if (!category) return;
    const currentDialog = dialog.current;
    currentDialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      currentDialog?.close();
    };
  }, [category]);

  if (!category) return null;

  const available = category.services.filter(
    (service) => service.enabled && service.confirmed
  );

  return (
    <dialog
      className="service-dialog"
      ref={dialog}
      aria-labelledby="service-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-photo">
        <SafeImage
          src={category.image}
          alt={category.imageAlt}
          width="900"
          height="450"
        />
        <span className="photo-credit">Illustrative studio visual</span>
        <button
          autoFocus
          className="dialog-close"
          onClick={onClose}
          aria-label="Close service details"
        >
          <X size={20} />
        </button>
      </div>
      <div className="dialog-content">
        <div className="eyebrow">THE CARE GUIDE</div>
        <h2 id="service-title">{category.title}</h2>
        <p>{category.detail}</p>
        <h3>Start with the details</h3>
        <ul className="detail-topics">
          {category.topics.map((topic) => (
            <li key={topic}>
              <Check size={16} />
              {topic}
            </li>
          ))}
        </ul>
        {available.length ? (
          <>
            <h3>Available services</h3>
            <ul>
              {available.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="availability-note">
            Service availability is being confirmed. This is a care guide, not a
            list of currently bookable services.
          </p>
        )}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <Link
            to={`/${category.slug}`}
            className="button button-dark"
            onClick={onClose}
          >
            View Full {category.shortTitle} Page <ArrowUpRight size={16} />
          </Link>
          <a
            href="#contact"
            className="button button-primary"
            onClick={onClose}
          >
            Tell us what you need <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </dialog>
  );
}

/**
 * Highlights Stage / Services Section
 */
export default function ServicesSection() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="services" className="services-section section-pad">
      <div className="wrap">
        {/* Suggested Directory Menu */}
        <div className="services-quick-nav" aria-label="Services directory menu">
          <div className="quick-nav-header">
            <span className="quick-nav-title">SERVICES DIRECTORY</span>
            <span className="quick-nav-sub">
              Multi-brand car care • Mechanical • Detailing • Paint Protection
            </span>
          </div>
          <div className="quick-nav-pills">
            {business.serviceMenu.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`quick-pill ${item.label === "Book a Service" ? "quick-pill-cta" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Section Heading */}
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> MULTI-BRAND CAR CARE • MECHANICAL • DETAILING • PAINT PROTECTION
            </div>
            <h2>
              Complete Automotive Care.
              <br />
              <span className="muted">Built for the Pressure.</span>
            </h2>
          </div>
          <div className="heading-aside">
            <p>
              From everyday upkeep to bespoke ceramic studio and body repair.
              <br />
              Care that starts with understanding your car.
            </p>
            <Link to="/services" className="text-link">
              Explore All 9 Departments <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        {/* Operational Notice Box */}
        <div className="services-notice-box" role="note">
          <div className="notice-icon">
            <ShieldCheck size={20} />
          </div>
          <div className="notice-copy">
            <strong>Workshop Operational Notice:</strong>
            <p>{business.operationalNote}</p>
          </div>
        </div>

        {/* 28px Feature Cards Grid */}
        <div className="service-grid">
          {business.categories.slice(0, 3).map((category, index) => (
            <Link
              key={category.id}
              to={`/${category.slug}`}
              className="service-card"
              aria-label={`Explore ${category.title}`}
            >
              <div className="service-image">
                <SafeImage
                  src={category.image}
                  alt={category.imageAlt}
                  width="600"
                  height="440"
                  loading="lazy"
                />
                <span className="card-number">0{index + 1}</span>
                <span className="service-icon">
                  {index === 0 ? (
                    <Wrench size={19} />
                  ) : index === 1 ? (
                    <Sparkles size={19} />
                  ) : (
                    <ShieldCheck size={19} />
                  )}
                </span>
              </div>
              <div className="card-copy">
                <div>
                  <h3>{category.shortTitle}</h3>
                  <p>{category.description}</p>
                </div>
                <span className="circle-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer & Expandable Care Areas */}
        <div className="services-footer">
          <p>
            <span className="status-dot" /> Care guides · Service availability to
            be confirmed.
          </p>
          <button
            className="text-link"
            aria-expanded={expanded}
            aria-controls="all-care-areas"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show fewer care areas" : "Explore all care areas"}{" "}
            <Plus size={16} className={expanded ? "rotate-45" : ""} />
          </button>
        </div>

        <div id="all-care-areas" hidden={!expanded} className="more-services">
          {business.categories.slice(3).map((category) => (
            <Link
              key={category.id}
              to={`/${category.slug}`}
              className="more-service-card"
            >
              <span>{category.title}</span>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>

        {/* Confirmed Services (if active) */}
        {confirmedServices.length > 0 && (
          <div className="confirmed-services">
            <h3>Available services</h3>
            <ul>
              {confirmedServices.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ServiceDialog category={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
