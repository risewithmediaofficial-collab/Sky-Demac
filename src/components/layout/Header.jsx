import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  Wrench,
  Sparkles,
  Car,
  Layers,
  Cpu,
  CircleDot,
  Zap,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { business } from "../../config";
import Wordmark from "../common/Wordmark";

/**
 * Maps category IDs to corresponding Lucide icons
 */
export function getCategoryNavIcon(id) {
  switch (id) {
    case "mechanical":
      return <Wrench size={16} />;
    case "detailing":
    case "ppf":
      return <Sparkles size={16} />;
    case "wash":
      return <Car size={16} />;
    case "body-shop":
      return <Layers size={16} />;
    case "accessories":
      return <Cpu size={16} />;
    case "wheels":
      return <CircleDot size={16} />;
    case "electrical":
      return <Zap size={16} />;
    case "special-care":
      return <Gauge size={16} />;
    default:
      return <ShieldCheck size={16} />;
  }
}

/**
 * Site Navigation Header
 * Features desktop hover dropdown with bridge & mobile drawer navigation
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // IntersectionObserver for tracking active homepage section
  useEffect(() => {
    if (!isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -55% 0px" }
    );

    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isHome]);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setServicesOpen(false);
        toggle.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenus = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  const otherLinks = [
    { id: "our-work", title: "Our Work", href: isHome ? "#our-work" : "/gallery" },
    { id: "about", title: "About", href: isHome ? "#about" : "/about" },
    { id: "contact", title: "Contact", href: isHome ? "#contact" : "/contact" },
  ];

  return (
    <header className="site-header">
      <div className="nav-wrap wrap">
        {/* Brand Logo / Wordmark */}
        <Link
          to="/"
          className="brand"
          aria-label="SKY DEMAC AUTOMOTIVE home"
          onClick={() => {
            closeMenus();
            if (isHome) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Wordmark />
        </Link>

        {/* Primary Navigation */}
        <nav
          className={`navigation ${open ? "is-open" : ""}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {/* Home Link */}
          {isHome ? (
            <a
              href="#home"
              className={active === "home" ? "active" : ""}
              aria-current={active === "home" ? "location" : undefined}
              onClick={() => {
                closeMenus();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </a>
          ) : (
            <Link
              to="/"
              className={active === "home" ? "active" : ""}
              onClick={closeMenus}
            >
              Home
            </Link>
          )}

          {/* Services Dropdown (Desktop Hover & Mobile Expandable) */}
          <div
            className={`nav-dropdown-item ${servicesOpen ? "dropdown-active" : ""}`}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            {isHome ? (
              <a
                href="#services"
                className={`nav-dropdown-trigger ${active === "services" ? "active" : ""}`}
                onClick={() => {
                  closeMenus();
                  requestAnimationFrame(() => {
                    const target = document.getElementById("services");
                    if (target) {
                      target.tabIndex = -1;
                      target.focus({ preventScroll: true });
                    }
                  });
                }}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  size={14}
                  className={`dropdown-arrow ${servicesOpen ? "rotate-180" : ""}`}
                />
              </a>
            ) : (
              <Link
                to="/services"
                className={`nav-dropdown-trigger ${active === "services" ? "active" : ""}`}
                onClick={closeMenus}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  size={14}
                  className={`dropdown-arrow ${servicesOpen ? "rotate-180" : ""}`}
                />
              </Link>
            )}

            {/* Desktop Dropdown Menu */}
            <div
              className={`nav-services-dropdown ${servicesOpen ? "is-open" : ""}`}
              role="menu"
              aria-label="Services Directory"
            >
              <div className="dropdown-inner-box">
                <div className="dropdown-top-meta">
                  <div>
                    <span className="dropdown-badge">DEPARTMENTS DIRECTORY</span>
                    <p className="dropdown-meta-title">Specialized Automotive Care</p>
                  </div>
                  <Link
                    to="/services"
                    className="dropdown-explore-all"
                    onClick={closeMenus}
                  >
                    View All 9 Departments <ArrowUpRight size={14} />
                  </Link>
                </div>

                <div className="dropdown-services-grid">
                  {business.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/${cat.slug}`}
                      className="dropdown-service-link"
                      role="menuitem"
                      onClick={closeMenus}
                    >
                      <div className="dropdown-icon-frame">
                        {getCategoryNavIcon(cat.id)}
                      </div>
                      <div className="dropdown-link-text">
                        <span className="dropdown-service-name">{cat.title}</span>
                        <span className="dropdown-service-sub">
                          {cat.shortTitle} • Detail Page
                        </span>
                      </div>
                      <ArrowUpRight size={14} className="dropdown-item-arrow" />
                    </Link>
                  ))}
                </div>

                <div className="dropdown-bottom-action">
                  <span>Need an immediate consultation or custom diagnostic?</span>
                  <Link
                    to="/book-service"
                    className="dropdown-book-btn"
                    onClick={closeMenus}
                  >
                    Book a Service <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Services Accordion (Strictly hidden on desktop via CSS) */}
            <div
              className={`mobile-services-accordion ${servicesOpen ? "is-open" : ""}`}
            >
              {business.categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/${cat.slug}`}
                  className="mobile-sub-link"
                  onClick={closeMenus}
                >
                  <div className="mobile-sub-left">
                    {getCategoryNavIcon(cat.id)}
                    <span>{cat.title}</span>
                  </div>
                  <ArrowUpRight size={13} />
                </Link>
              ))}
              <Link
                to="/services"
                className="mobile-sub-link mobile-all-services"
                onClick={closeMenus}
              >
                <span>View All 9 Departments</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          {/* Other Nav Links */}
          {otherLinks.map(({ id, title, href }) => {
            const isAnchor = href.startsWith("#");
            return isAnchor ? (
              <a
                key={id}
                href={href}
                className={active === id ? "active" : ""}
                aria-current={active === id ? "location" : undefined}
                onClick={() => {
                  closeMenus();
                  requestAnimationFrame(() => {
                    const target = document.getElementById(id);
                    if (target) {
                      target.tabIndex = -1;
                      target.focus({ preventScroll: true });
                    }
                  });
                }}
              >
                {title}
              </a>
            ) : (
              <Link
                key={id}
                to={href}
                className={active === id ? "active" : ""}
                onClick={closeMenus}
              >
                {title}
              </Link>
            );
          })}

          {/* Mobile Drawer CTA Button (Strictly hidden on desktop via CSS) */}
          <div className="mobile-drawer-cta">
            <Link
              to="/book-service"
              className="button button-primary mobile-drawer-btn"
              onClick={closeMenus}
            >
              Book a Service <ArrowUpRight size={15} />
            </Link>
          </div>
        </nav>

        {/* Desktop Quick Header CTA */}
        <a
          className="nav-cta"
          href={isHome ? "#contact" : "/contact"}
          aria-label="Enquire About a Service"
          onClick={closeMenus}
        >
          <span className="hidden sm:inline">Enquire About a Service</span>
          <span className="inline sm:hidden" aria-hidden="true">
            Enquire
          </span>
          <ArrowUpRight size={15} />
        </a>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </header>
  );
}
