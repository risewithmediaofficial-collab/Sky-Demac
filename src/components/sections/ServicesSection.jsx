import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Cpu,
  Check,
  Hammer,
  Paintbrush,
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
  const categoryById = Object.fromEntries(
    business.categories.map((category) => [category.id, category]),
  );
  const featuredServices = [
    {
      ...categoryById.detailing,
      featureId: "detailing",
      shortTitle: "Detailing",
      description: "Deep cleaning, correction and a finish worth looking back at.",
      kicker: "Finish & protection",
      icon: Sparkles,
    },
    {
      ...categoryById.mechanical,
      featureId: "mechanical",
      shortTitle: "Mechanical",
      description: "Clear diagnosis and dependable care for the way your car drives.",
      kicker: "Service & repair",
      icon: Wrench,
    },
    {
      ...categoryById["body-shop"],
      featureId: "premium-painting",
      shortTitle: "Premium painting",
      description: "Careful preparation, colour matching and a clean lasting finish.",
      kicker: "Body & paint",
      image: "/images/exterior.webp",
      icon: Paintbrush,
    },
    {
      ...categoryById.accessories,
      featureId: "accessories",
      shortTitle: "Accessories",
      description: "Useful upgrades, fitted neatly and selected for your car.",
      kicker: "Comfort & technology",
      icon: Cpu,
    },
    {
      ...categoryById["body-shop"],
      featureId: "tinkering",
      shortTitle: "Tinkering",
      description: "Dent correction and panel work shaped with patient attention.",
      kicker: "Panel correction",
      image: "/images/mechanical.webp",
      icon: Hammer,
    },
  ];

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

        {/* Section Heading with Modern Typography & Alignment */}
        <div className="section-heading services-modern-heading">
          <div>
            <div className="modern-pill-badge">
              <span className="pill-dot" /> MULTI-BRAND CAR CARE • PRECISION DIRECTORY
            </div>
            <h2 className="modern-display-heading">
              <span>FIVE WAYS WE</span>
              <span className="heading-inline-group">
                <span className="tilted-pill-badge">CERTIFIED STUDIO</span>
                <span className="accent-text">CARE FOR YOUR CAR</span>
              </span>
            </h2>
          </div>
          <div className="heading-aside">
            <p>
              From the way it drives to the way it looks, start with the care
              your car needs today.
            </p>
            <Link to="/services" className="button button-dark">
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

        <div className="service-grid service-bento-grid">
          {featuredServices.map((category, index) => {
            const ServiceIcon = category.icon;
            return (
              <Link
                key={category.featureId}
                to={`/${category.slug}`}
                className={`service-card service-card-${index + 1}`}
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
                  <span className="service-icon" aria-hidden="true">
                    <ServiceIcon size={19} />
                  </span>
                </div>
                <div className="card-copy">
                  <div>
                    <span className="service-kicker">{category.kicker}</span>
                    <h3>{category.shortTitle}</h3>
                    <p>{category.description}</p>
                  </div>
                </div>
                <span className="circle-arrow" aria-hidden="true">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            );
          })}
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
