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
  const toggle = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Prevent background scrolling when mobile side drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  const [isScrolled, setIsScrolled] = useState(false);

  // Track window scroll to toggle transparent vs scrolled header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenus = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  // Determine active nav item based on route
  const currentPath = location.pathname;
  let activePage = "home";
  if (currentPath === "/") {
    activePage = "home";
  } else if (
    currentPath.startsWith("/services") ||
    business.categories.some((c) => currentPath === `/${c.slug}`)
  ) {
    activePage = "services";
  } else if (
    currentPath === "/gallery" ||
    currentPath === "/our-work" ||
    currentPath === "/work"
  ) {
    activePage = "our-work";
  } else if (currentPath === "/about") {
    activePage = "about";
  } else if (
    currentPath === "/contact" ||
    currentPath === "/book-service"
  ) {
    activePage = "contact";
  }

  const navLinks = [
    { id: "our-work", title: "Our Work", href: "/our-work" },
    { id: "about", title: "About", href: "/about" },
    { id: "contact", title: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`site-header ${isScrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}
    >
      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`nav-backdrop ${open ? "is-open" : ""}`}
        onClick={closeMenus}
        aria-hidden="true"
      />

      <div className="nav-wrap wrap">
        {/* Brand Logo / Wordmark */}
        <Link
          to="/"
          className="brand"
          aria-label="SKY DEMAC AUTOMOTIVE home"
          onClick={() => {
            closeMenus();
            if (isHome) {
              if (window.__lenis) {
                window.__lenis.scrollTo(0, { duration: 1.0 });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
        >
          <Wordmark />
        </Link>

        {/* Primary Navigation / Mobile Side Drawer */}
        <nav
          className={`navigation ${open ? "is-open" : ""}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {/* Mobile Drawer Header with Close Button */}
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">Navigation</span>
            <button
              type="button"
              className="mobile-drawer-close"
              onClick={closeMenus}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Home Link */}
          <Link
            to="/"
            className={activePage === "home" ? "active" : ""}
            aria-current={activePage === "home" ? "page" : undefined}
            onClick={() => {
              closeMenus();
              if (isHome) {
                if (window.__lenis) {
                  window.__lenis.scrollTo(0, { duration: 1.0 });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }
            }}
          >
            Home
          </Link>

          {/* Services Dropdown (Click navigates to /services, Hover opens menu on desktop, toggle on mobile) */}
          <div
            className={`nav-dropdown-item ${servicesOpen ? "dropdown-active" : ""}`}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <div className="nav-dropdown-head">
              <Link
                to="/services"
                className={`nav-dropdown-trigger ${activePage === "services" ? "active" : ""}`}
                onClick={closeMenus}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
              </Link>
              <button
                type="button"
                className="mobile-accordion-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setServicesOpen((prev) => !prev);
                }}
                aria-label={servicesOpen ? "Collapse services" : "Expand services"}
              >
                <ChevronDown
                  size={15}
                  className={`dropdown-arrow ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

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
          {/* Other Nav Links */}
          {navLinks.map(({ id, title, href }) => (
            <Link
              key={id}
              to={href}
              className={activePage === id ? "active" : ""}
              aria-current={activePage === id ? "page" : undefined}
              onClick={closeMenus}
            >
              {title}
            </Link>
          ))}

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
        <Link
          className="nav-cta"
          to="/contact"
          aria-label="Enquire About a Service"
          onClick={closeMenus}
        >
          <span className="hidden sm:inline">Enquire About a Service</span>
          <span className="inline sm:hidden" aria-hidden="true">
            Enquire
          </span>
          <ArrowUpRight size={15} />
        </Link>

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
