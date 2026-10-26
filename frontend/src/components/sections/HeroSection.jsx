import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { isServiceActive } from "../../config";
import AnimatedHeroWheel from "./AnimatedHeroWheel";

const protectionEnabled = ["ppf", "ceramic-coating", "specialised-coating"].some(isServiceActive);

const scenes = [
  {
    id: "opening",
    label: "The opening",
    eyebrow: "PRECISION ENGINEERING.",
    copy: "Bespoke automotive care. Masterful precision.",
    image: "/wheel-hero/hero-background.webp",
  },
  {
    id: "mechanical",
    label: "Mechanical care",
    eyebrow: "02 / MECHANICAL CARE",
    title: "Precision in every service.",
    copy: "A closer look. A clearer understanding.",
    image: "/images/dodge-challenger-workshop.jpg",
  },
  {
    id: "detailing",
    label: "The finer details",
    eyebrow: "03 / THE FINER DETAILS",
    title: "Every detail. Refined.",
    copy: "A considered approach to every surface.",
    image: "/images/ferrari-red-studio.jpg",
  },
  {
    id: "exterior",
    label: protectionEnabled ? "Paint protection" : "Exterior care",
    eyebrow: protectionEnabled ? "04 / PAINT PROTECTION" : "04 / EXTERIOR CARE",
    title: protectionEnabled ? "Protect every finish." : "Care for every curve.",
    copy: protectionEnabled
      ? "An illustrative study in surface protection."
      : "Thoughtful care, down to the finish.",
    image: "/images/mustang-track-red.jpg",
  },
  {
    id: "complete",
    label: "Complete care",
    eyebrow: "05 / COMPLETE AUTOMOTIVE CARE",
    title: "Complete care. One destination.",
    copy: "For the everyday drive. And everything that drives you.",
    image: "/images/ferrari-red-action.jpg",
  },
];

function Caption({ index }) {
  const scene = scenes[index];
  return (
    <div className="caption-plain">
      <div className="modern-pill-badge">
        <span className="pill-dot" /> {scene.eyebrow}
      </div>
      {index === 0 ? (
        <h1 className="modern-display-heading" style={{ color: "#ffffff" }}>
          <span style={{ color: "#ffffff" }}>ENGINEERED FOR</span>
          <span className="accent-text" style={{ color: "#e31e24" }}>
            PERFORMANCE.
          </span>
        </h1>
      ) : (
        <h2
          className="modern-display-heading"
          style={{ fontSize: "clamp(24px, 3.5vw, 44px)", color: "#ffffff" }}
        >
          {scene.title}
        </h2>
      )}
      <p className="cinema-support">{scene.copy}</p>
      <div className="cinema-actions">
        <Link to="/services" className="button button-primary">
          Explore Services <ArrowUpRight size={15} />
        </Link>
        <Link to="/contact" className="cinema-secondary">
          Enquire Now <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}

/**
 * HeroSection
 * Clean, normal rectangular hero presentation with subtle rounded corners.
 * Free of 3D folded geometry or perspective distortion.
 * Features the 10-second continuous Porsche wheel animation and full carousel navigation.
 */
export default function HeroSection({ isLoaded = false }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const hasInteractedRef = useRef(false);

  // Gesture tracking
  const isTouchActiveRef = useRef(false);
  const isHorizSwipeRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const isMouseDraggingRef = useRef(false);
  const mouseStartXRef = useRef(0);

  const markInteracted = useCallback(() => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      setHasInteracted(true);
    }
  }, []);

  const goToChapter = useCallback((idx) => {
    markInteracted();
    const clamped = Math.max(0, Math.min(scenes.length - 1, idx));
    setActiveIndex(clamped);
  }, [markInteracted]);

  const handlePrev = useCallback(() => {
    goToChapter(activeIndex - 1);
  }, [activeIndex, goToChapter]);

  const handleNext = useCallback(() => {
    goToChapter(activeIndex + 1);
  }, [activeIndex, goToChapter]);

  // Touch gesture listeners (Mobile swipe)
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    isTouchActiveRef.current = true;
    isHorizSwipeRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isTouchActiveRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartXRef.current;
    const dy = touch.clientY - touchStartYRef.current;

    if (!isHorizSwipeRef.current) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        isHorizSwipeRef.current = true;
        markInteracted();
      } else if (Math.abs(dy) > 12) {
        isTouchActiveRef.current = false;
      }
    }

    if (isHorizSwipeRef.current && e.cancelable) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (isHorizSwipeRef.current && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;
      if (dx < -40) {
        handleNext();
      } else if (dx > 40) {
        handlePrev();
      }
    }
    isTouchActiveRef.current = false;
    isHorizSwipeRef.current = false;
  };

  // Mouse drag listeners (Desktop horizontal drag)
  const handleMouseDown = (e) => {
    if (e.target.closest("button, a, input, select, textarea")) return;
    isMouseDraggingRef.current = true;
    mouseStartXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDraggingRef.current) return;
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (isMouseDraggingRef.current) {
      const dx = e.clientX - mouseStartXRef.current;
      if (dx < -50) {
        handleNext();
      } else if (dx > 50) {
        handlePrev();
      }
      isMouseDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if (e.key === "ArrowRight") {
        goToChapter(activeIndex + 1);
      } else if (e.key === "ArrowLeft") {
        goToChapter(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goToChapter]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className={`cinema-story is-animated is-side-scroll ${isDragging ? "is-dragging" : ""}`}
      aria-label="SKY DEMAC Automotive Engineering showcase"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="cinema-stage" ref={stageRef}>
        <div className="hero-ambient hero-ambient-one" aria-hidden="true" />
        <div className="hero-ambient hero-ambient-two" aria-hidden="true" />

        {/* Floating Side Navigation Buttons for Desktop & Mobile */}
        <button
          type="button"
          className={`hero-side-btn hero-side-btn-prev ${activeIndex === 0 ? "is-disabled" : ""}`}
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Previous chapter"
          title="Previous chapter"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          className={`hero-side-btn hero-side-btn-next ${activeIndex === scenes.length - 1 ? "is-disabled" : ""}`}
          onClick={handleNext}
          disabled={activeIndex === scenes.length - 1}
          aria-label="Next chapter"
          title="Next chapter"
        >
          <ChevronRight size={22} />
          {activeIndex === 0 && <span className="side-btn-pulse-wave" aria-hidden="true" />}
        </button>

        {/* Clean, Normal Rectangular Hero Image Frame with Subtle Rounded Corners */}
        <div className="hero-display-card" aria-label="Automotive showcase">
          <div className="hero-display-stack">
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className={`hero-display-art ${activeIndex === index ? "is-active" : ""}`}
              >
                {index === 0 ? (
                  <AnimatedHeroWheel isActive={isLoaded} />
                ) : (
                  <img
                    src={scene.image}
                    alt={scene.label}
                    className="hero-display-img"
                    loading={index <= 1 ? "eager" : "lazy"}
                    decoding="async"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Captions positioned with modern typography */}
        <div className="cinema-copy-layer">
          {scenes.map((scene, index) => (
            <div
              className={`cinema-caption cinema-caption-${index % 2 === 0 ? "left" : "right"} ${
                activeIndex === index ? "is-active" : ""
              }`}
              data-scene={index}
              key={scene.id}
              aria-hidden={activeIndex !== index}
            >
              <Caption index={index} />
            </div>
          ))}
        </div>

        {/* Side-Scroll Exploration Indication */}
        <div
          className={`hero-side-scroll-hint ${hasInteracted ? "is-subtle" : ""}`}
          onClick={handleNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleNext();
          }}
          aria-label="Swipe or drag sideways to explore chapters"
        >
          <div className="hint-pill">
            <span className="hint-chevron hint-chevron-left" aria-hidden="true">
              <ChevronLeft size={15} />
            </span>
            <span className="hint-icon-wrap" aria-hidden="true">
              <svg
                className="hint-swipe-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 11V6a2 2 0 0 0-4 0v5" />
                <path d="M14 10V4a2 2 0 0 0-4 0v7" />
                <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
                <path d="M18 8a2 2 0 0 1 4 4v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 17" />
              </svg>
            </span>
            <div className="hint-label-stack">
              <span className="hint-label">
                <span className="hint-label-mobile">SWIPE SIDEWAYS TO EXPLORE</span>
                <span className="hint-label-desktop">DRAG OR CLICK TO EXPLORE</span>
              </span>
              <span className="hint-chapter-status-mobile" aria-hidden="true">
                0{activeIndex + 1} / 05 · {scenes[activeIndex].label}
              </span>
            </div>
            <span className="hint-chevron hint-chevron-right" aria-hidden="true">
              <ChevronRight size={15} />
            </span>
          </div>
        </div>

        {/* Chapter Navigation Bar */}
        <div className="cinema-bottom">
          <a className="cinema-skip" href="#services">
            Scroll to services <ArrowDown size={14} />
          </a>
          <div className="cinema-chapter">
            <span className="cinema-chapter-number">0{activeIndex + 1}</span>
            <span className="cinema-chapter-line" />
            <span>{scenes[activeIndex].label}</span>
            <span className="cinema-chapter-total">/ 05</span>
          </div>
          <div className="cinema-mobile-status" aria-hidden="true">
            0{activeIndex + 1} / 05 · {scenes[activeIndex].label}
          </div>
          <div className="cinema-chapter-dots" aria-label="Select chapter">
            {scenes.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={`chapter-dot ${activeIndex === idx ? "is-active" : ""}`}
                onClick={() => goToChapter(idx)}
                aria-label={`Jump to chapter ${idx + 1}: ${s.label}`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Progress Bar */}
        <div
          className="cinema-progress"
          aria-hidden="true"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickFraction = (e.clientX - rect.left) / rect.width;
            const targetChapter = Math.round(clickFraction * (scenes.length - 1));
            goToChapter(targetChapter);
          }}
          title="Click to seek"
        >
          <span
            className="cinema-progress-fill"
            style={{
              transform: `scaleX(${(activeIndex + 1) / scenes.length})`,
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
