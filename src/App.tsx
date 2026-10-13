import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { business, confirmedServices, type CareCategory } from "./config";
import HeroStory from "./components/HeroStory";
import EnquiryForm from "./components/EnquiryForm";
import SafeImage from "./components/SafeImage";
import { useSectionReveals } from "./components/useSectionReveals";
import "./App.css";

function Wordmark() {
  return business.logo ? (
    <img className="brand-logo" src={business.logo} alt={business.name} />
  ) : (
    <span className="wordmark">
      SKY DEMAC<span>AUTOMOTIVE</span>
    </span>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", close);
    };
  }, []);
  const links = [
    ["home", "Home"],
    ["services", "Services"],
    ["our-work", "Our Work"],
    ["about", "About"],
    ["contact", "Contact"],
  ];
  return (
    <header className="site-header">
      <div className="nav-wrap wrap">
        <a
          href="#home"
          className="brand"
          aria-label="SKY DEMAC AUTOMOTIVE home"
          onClick={() => setOpen(false)}
        >
          <Wordmark />
        </a>
        <nav
          className={`navigation ${open ? "is-open" : ""}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {links.map(([id, title]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "location" : undefined}
              onClick={() => {
                setOpen(false);
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
          ))}
        </nav>
        <a
          className="nav-cta"
          href="#contact"
          aria-label="Enquire About a Service"
          onClick={() => setOpen(false)}
        >
          <span className="cta-full">Enquire About a Service</span>
          <span className="cta-short" aria-hidden="true">
            Enquire
          </span>
          <ArrowUpRight size={16} />
        </a>
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

function ServiceDialog({
  category,
  onClose,
}: {
  category: CareCategory | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
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
    (service) => service.enabled && service.confirmed,
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
        <a href="#contact" className="button button-primary" onClick={onClose}>
          Tell us what you need <ArrowUpRight size={17} />
        </a>
      </div>
    </dialog>
  );
}

function Services() {
  const [selected, setSelected] = useState<CareCategory | null>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="services" className="services-section section-pad">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> THE COMPLETE PICTURE
            </div>
            <h2>
              Every need.
              <br />
              <span className="muted">One considered approach.</span>
            </h2>
          </div>
          <div className="heading-aside">
            <p>
              From everyday upkeep to the finer details.
              <br />
              Care that starts with understanding your car.
            </p>
            <a href="#contact" className="text-link">
              Let’s talk about your car <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div className="service-grid">
          {business.categories.slice(0, 3).map((category, index) => (
            <button
              key={category.id}
              className="service-card"
              onClick={() => setSelected(category)}
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
            </button>
          ))}
        </div>
        <div className="services-footer">
          <p>
            <span className="status-dot" /> Care guides · Service availability
            to be confirmed.
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
            <button key={category.id} onClick={() => setSelected(category)}>
              <span>{category.title}</span>
              <ArrowUpRight size={20} />
            </button>
          ))}
        </div>
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

function Work() {
  const [filter, setFilter] = useState("All");
  const projects = business.projects.filter((project) => project.genuine);
  return (
    <section id="our-work" className="work-section section-pad">
      <div className="wrap">
        <div className="work-layout">
          <div className="work-image">
            <SafeImage
              src="/images/detailing.webp"
              alt="Illustrative close-up of light tracing the bonnet of a graphite coupe"
              width="1000"
              height="1000"
              loading="lazy"
            />
            <span className="image-corner-label">A STUDY IN DETAIL</span>
            <span className="photo-credit">
              Illustrative visual · not a customer project
            </span>
          </div>
          <div className="work-copy">
            <div className="eyebrow">
              <span /> IT’S IN THE DETAILS
            </div>
            <h2>
              Good care is felt.
              <br />
              <span className="muted">Great care is noticed.</span>
            </h2>
            <p>
              The clean line of a reflection. The feeling behind the wheel. The
              confidence to take the long way home.
            </p>
            <p>
              We’re building SKY DEMAC around a simple idea: every part of your
              car deserves a considered approach.
            </p>
            <a href="#about" className="text-link">
              Get to know SKY DEMAC <ArrowUpRight size={17} />
            </a>
            <div className="detail-caption">
              <span>01 — 03</span>
              <span>PERFORMANCE. FINISH. FEEL.</span>
            </div>
          </div>
        </div>
        {projects.length > 0 && (
          <div className="project-gallery">
            <div className="eyebrow">FROM THE WORKSHOP</div>
            <h2>Our work.</h2>
            <div className="gallery-filters" aria-label="Filter projects">
              {[
                "All",
                ...new Set(projects.map((project) => project.category)),
              ].map((value) => (
                <button
                  key={value}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="project-grid">
              {projects
                .filter(
                  (project) => filter === "All" || project.category === filter,
                )
                .map((project) => (
                  <figure key={project.id}>
                    <SafeImage
                      src={project.image}
                      alt={project.alt}
                      width="700"
                      height="500"
                      loading="lazy"
                    />
                    <figcaption>{project.title}</figcaption>
                  </figure>
                ))}
            </div>
          </div>
        )}
        {business.comparison?.genuine && <Comparison />}
      </div>
    </section>
  );
}

function Comparison() {
  const [value, setValue] = useState(50);
  const comparison = business.comparison!;
  return (
    <div className="comparison">
      <h3>A closer look, before and after.</h3>
      <div className="comparison-images">
        <SafeImage
          src={comparison.after}
          alt={`After: ${comparison.alt}`}
          width="1200"
          height="800"
          loading="lazy"
        />
        <div style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <SafeImage
            src={comparison.before}
            alt={`Before: ${comparison.alt}`}
            width="1200"
            height="800"
            loading="lazy"
          />
        </div>
        <span className="comparison-before">Before</span>
        <span className="comparison-after">After</span>
      </div>
      <label htmlFor="comparison">Compare before and after</label>
      <input
        id="comparison"
        type="range"
        min="0"
        max="100"
        value={value}
        aria-valuetext={`${value}% before, ${100 - value}% after`}
        onChange={(event) => setValue(Number(event.target.value))}
      />
    </div>
  );
}

function Process() {
  return (
    <section className="process-section section-pad">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> A CLEAR PATH, START TO FINISH
            </div>
            <h2>Know what comes next.</h2>
          </div>
          <p className="process-intro">
            A thoughtful service journey.
            <br />
            With you at every step.
          </p>
        </div>
        <ol className="process-grid">
          {business.process.map((step, index) => (
            <li key={step.title}>
              <div className="step-line">
                <span>0{index + 1}</span>
                {index !== 4 && <ArrowRight size={17} />}
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        {!business.processConfirmed && (
          <p className="process-note">
            Our proposed service journey. Individual arrangements will be
            confirmed with the workshop.
          </p>
        )}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="about-section">
      <div className="wrap about-layout">
        <div>
          <div className="eyebrow light">
            <span /> MEET SKY DEMAC
          </div>
          <h2>
            For people who
            <br />
            care about
            <br />
            <span>their cars.</span>
          </h2>
        </div>
        <div className="about-copy">
          <p className="about-lead">
            More than a way to get there.
            <br />
            Your car is part of your everyday.
          </p>
          <p>
            SKY DEMAC AUTOMOTIVE brings a focus on complete automotive care,
            premium detailing and professional maintenance. Our approach begins
            with understanding the car, the concern and the person behind the
            wheel.
          </p>
          <a className="text-link light-link" href="#contact">
            Start a conversation <ArrowUpRight size={18} />
          </a>
        </div>
        {business.studioImage && (
          <SafeImage
            className="studio-image"
            src={business.studioImage}
            alt="The SKY DEMAC AUTOMOTIVE workshop"
            width="1200"
            height="700"
            loading="lazy"
          />
        )}
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    [
      "Does an enquiry confirm an appointment?",
      "No. An enquiry starts a conversation. The workshop must confirm the requested service, availability and date before any appointment is arranged.",
    ],
    [
      "What information should I include?",
      "Share your name, mobile number, car make and model, and what you would like help with. A preferred date and any details about the car’s condition can make the conversation easier.",
    ],
    [
      "Which services can I request?",
      confirmedServices.length
        ? "Confirmed services are listed in the enquiry form. If you are unsure which one fits, choose the general enquiry option and describe what your car needs."
        : "The workshop’s operational service list is being confirmed. For now, you can prepare a general enquiry. The care guides explain areas to discuss and do not confirm service availability.",
    ],
    [
      "Can I get a price or completion date here?",
      "Prices and turnaround times are not published here. These details need to be discussed with the workshop based on the vehicle, its condition and the work required.",
    ],
  ];
  return (
    <section className="faq-section section-pad">
      <div className="wrap faq-layout">
        <div>
          <div className="eyebrow">
            <span /> A LITTLE CLARITY
          </div>
          <h2>
            Before you
            <br />
            <span className="muted">drop us a line.</span>
          </h2>
          <a className="text-link" href="#contact">
            Have something else in mind? <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={19} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact-section section-pad">
      <div className="wrap contact-layout">
        <div className="contact-copy">
          <div className="eyebrow">
            <span /> YOUR NEXT DRIVE STARTS HERE
          </div>
          <h2>
            Let’s talk
            <br />
            <span className="muted">about your car.</span>
          </h2>
          <p>
            A concern to look into. A finish to bring back.
            <br />
            Tell us what you have in mind.
          </p>
          <div className="contact-details">
            {business.phone && (
              <a href={`tel:${business.phone}`}>
                <Phone size={19} />
                <span>
                  <small>CALL THE WORKSHOP</small>
                  {business.phone}
                </span>
                <ArrowUpRight size={17} />
              </a>
            )}
            {business.email && (
              <a href={`mailto:${business.email}`}>
                <Mail size={19} />
                <span>
                  <small>EMAIL US</small>
                  {business.email}
                </span>
                <ArrowUpRight size={17} />
              </a>
            )}
            {business.address && (
              <div className="address-line">
                <MapPin size={19} />
                <span>
                  <small>FIND US</small>
                  {business.address}
                  {business.mapUrl && (
                    <a href={business.mapUrl} target="_blank" rel="noreferrer">
                      Get directions <ArrowUpRight size={15} />
                    </a>
                  )}
                </span>
              </div>
            )}
            {business.openingHours && <p>{business.openingHours}</p>}
            {!business.phone && !business.email && (
              <div className="contact-pending">
                <span className="status-dot" />
                <div>
                  <strong>Good conversations start here.</strong>
                  <p>
                    Workshop contact details and opening hours will be shared
                    once confirmed.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="contact-signature">
            <span>SKY DEMAC</span>
            <p>Built for the Pressure.</p>
          </div>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}

function Footer() {
  const [year] = useState(() => new Date().getFullYear());
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <a href="#home" className="brand">
            <Wordmark />
          </a>
          <p>
            Complete Automotive Care. Premium Detailing.
            <br />
            Professional Maintenance.
          </p>
          <a className="back-top" href="#home">
            Back to top <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {year} SKY DEMAC AUTOMOTIVE</span>
          <span>Considered care. Every kilometre.</span>
          <div>
            {business.socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useSectionReveals();
  return (
    <div
      className="app"
      style={
        {
          "--accent": business.accent,
          "--accent-hover": business.accentHover,
        } as CSSProperties
      }
    >
      <a className="skip-link" href="#services">
        Skip to services
      </a>
      <Navigation />
      <main>
        <HeroStory />
        <div className="brand-strip">
          <div className="wrap">
            <span>COMPLETE AUTOMOTIVE CARE</span>
            <span className="strip-dot" />
            <span>PREMIUM DETAILING</span>
            <span className="strip-dot" />
            <span>PROFESSIONAL MAINTENANCE</span>
            <a href="#services" aria-label="Discover automotive care">
              <ArrowDown size={18} />
            </a>
          </div>
        </div>
        <Services />
        <Work />
        <Process />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
