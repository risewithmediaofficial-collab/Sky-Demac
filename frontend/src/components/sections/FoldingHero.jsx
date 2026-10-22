import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { isServiceActive } from "../../config";
import SafeImage from "../common/SafeImage";

const protectionEnabled = ["ppf", "ceramic-coating", "specialised-coating"].some(isServiceActive);
const scenes = [
  { id: "opening", label: "The opening", eyebrow: "ENGINEERED TO CARE.", copy: "Complete automotive care. Exceptional attention.", image: "/images/scene-wide.webp" },
  { id: "mechanical", label: "Mechanical care", eyebrow: "02 / MECHANICAL CARE", title: "Precision in every service.", copy: "A closer look. A clearer understanding.", image: "/images/scene-wheel.webp" },
  { id: "detailing", label: "The finer details", eyebrow: "03 / THE FINER DETAILS", title: "Every detail. Refined.", copy: "A considered approach to every surface.", image: "/images/scene-detail.webp" },
  { id: "exterior", label: protectionEnabled ? "Paint protection" : "Exterior care", eyebrow: protectionEnabled ? "04 / PAINT PROTECTION" : "04 / EXTERIOR CARE", title: protectionEnabled ? "Protect every finish." : "Care for every curve.", copy: protectionEnabled ? "An illustrative study in surface protection." : "Thoughtful care, down to the finish.", image: "/images/scene-exterior.webp" },
  { id: "complete", label: "Complete care", eyebrow: "05 / COMPLETE AUTOMOTIVE CARE", title: "Complete care. One destination.", copy: "For the everyday drive. And everything that drives you.", image: "/images/scene-wide.webp" },
];

const clamp = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => {
  const n = clamp(value);
  return n * n * (3 - 2 * n);
};

function PanelArt({ side }) {
  return (
    <div className="fold-phone-art-stack" aria-hidden="true">
      {scenes.map((scene, index) => (
        <div className="fold-phone-art" data-art={index} key={`${side}-${scene.id}`}>
          <SafeImage
            src={scene.image}
            className={`fold-phone-image fold-phone-image-${side}`}
            alt=""
            width="1805"
            height="871"
            loading={index <= 1 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}

function Caption({ index }) {
  const scene = scenes[index];
  return (
    <div className="caption-plain">
      <div className="modern-pill-badge">
        <span className="pill-dot" /> {scene.eyebrow}
      </div>
      {index === 0 ? (
        <h1 className="modern-display-heading" style={{ color: "#ffffff" }}>
          <span style={{ color: "#ffffff" }}>BUILT FOR THE</span>
          <span className="accent-text" style={{ color: "#e31e24" }}>PRESSURE.</span>
        </h1>
      ) : (
        <h2 className="modern-display-heading" style={{ fontSize: "clamp(24px, 3.5vw, 44px)", color: "#ffffff" }}>
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

export default function FoldingHero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Animation & Physics Engine Refs
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastActiveRef = useRef(-1);
  const hasInteractedRef = useRef(false);

  // Gesture tracking
  const isTouchActiveRef = useRef(false);
  const isHorizSwipeRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const lastTouchXRef = useRef(0);
  const lastTouchTimeRef = useRef(0);
  const velocityXRef = useRef(0);

  const isMouseDraggingRef = useRef(false);
  const mouseStartXRef = useRef(0);
  const mouseStartProgressRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const lastMouseTimeRef = useRef(0);

  const artsBySceneRef = useRef([]);
  const captionsRef = useRef([]);
  const deviceRef = useRef(null);
  const progressFillRef = useRef(null);

  // Update interaction state
  const markInteracted = useCallback(() => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      setHasInteracted(true);
    }
  }, []);

  // Jump smoothly to a specific chapter (0 to 4)
  const goToChapter = useCallback((idx) => {
    markInteracted();
    const clamped = Math.max(0, Math.min(scenes.length - 1, idx));
    targetProgressRef.current = clamped / (scenes.length - 1);
  }, [markInteracted]);

  const handlePrev = useCallback(() => {
    goToChapter(activeIndex - 1);
  }, [activeIndex, goToChapter]);

  const handleNext = useCallback(() => {
    goToChapter(activeIndex + 1);
  }, [activeIndex, goToChapter]);

  // Handle snap on gesture end
  const snapWithFlick = useCallback((velocity) => {
    const numChapters = scenes.length;
    const currentFraction = targetProgressRef.current * (numChapters - 1);
    let targetChapter = Math.round(currentFraction);

    // If flicked with sufficient momentum, advance or retreat
    if (velocity < -0.32) {
      targetChapter = Math.min(numChapters - 1, Math.floor(currentFraction) + 1);
    } else if (velocity > 0.32) {
      targetChapter = Math.max(0, Math.ceil(currentFraction) - 1);
    }

    goToChapter(targetChapter);
  }, [goToChapter]);

  // Touch gesture listeners (Mobile swipe)
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    lastTouchXRef.current = touch.clientX;
    lastTouchTimeRef.current = performance.now();
    mouseStartProgressRef.current = targetProgressRef.current;
    isTouchActiveRef.current = true;
    isHorizSwipeRef.current = false;
    velocityXRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isTouchActiveRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartXRef.current;
    const dy = touch.clientY - touchStartYRef.current;

    if (!isHorizSwipeRef.current) {
      // Horizontal swipe detected
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        isHorizSwipeRef.current = true;
        markInteracted();
      } else if (Math.abs(dy) > 10) {
        // Vertical scroll: do not intercept, allow natural page scroll
        isTouchActiveRef.current = false;
        return;
      }
    }

    if (isHorizSwipeRef.current) {
      if (e.cancelable) e.preventDefault(); // Lock page scroll while swiping sideways
      const now = performance.now();
      const dt = Math.max(1, now - lastTouchTimeRef.current);
      velocityXRef.current = (touch.clientX - lastTouchXRef.current) / dt;
      lastTouchXRef.current = touch.clientX;
      lastTouchTimeRef.current = now;

      const stageWidth = stageRef.current?.clientWidth || window.innerWidth;
      // Moving 65% of screen width shifts 1 chapter
      const progressDelta = -dx / (stageWidth * 0.85);
      targetProgressRef.current = clamp(mouseStartProgressRef.current + progressDelta);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizSwipeRef.current) {
      snapWithFlick(velocityXRef.current);
    }
    isTouchActiveRef.current = false;
    isHorizSwipeRef.current = false;
  };

  // Mouse drag listeners (Desktop horizontal drag)
  const handleMouseDown = (e) => {
    if (e.target.closest("button, a, input, select, textarea")) return;
    isMouseDraggingRef.current = true;
    mouseStartXRef.current = e.clientX;
    mouseStartProgressRef.current = targetProgressRef.current;
    lastMouseXRef.current = e.clientX;
    lastMouseTimeRef.current = performance.now();
    velocityXRef.current = 0;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDraggingRef.current) return;
    e.preventDefault();
    markInteracted();
    const dx = e.clientX - mouseStartXRef.current;
    const now = performance.now();
    const dt = Math.max(1, now - lastMouseTimeRef.current);
    velocityXRef.current = (e.clientX - lastMouseXRef.current) / dt;
    lastMouseXRef.current = e.clientX;
    lastMouseTimeRef.current = now;

    const stageWidth = stageRef.current?.clientWidth || window.innerWidth;
    const progressDelta = -dx / (stageWidth * 0.95);
    targetProgressRef.current = clamp(mouseStartProgressRef.current + progressDelta);
  };

  const handleMouseUp = () => {
    if (isMouseDraggingRef.current) {
      isMouseDraggingRef.current = false;
      setIsDragging(false);
      snapWithFlick(velocityXRef.current);
    }
  };

  // Horizontal wheel / trackpad side-scroll (e.g. shift+wheel or two-finger trackpad horizontal gesture)
  const handleWheel = (e) => {
    // If horizontal scroll is present (deltaX) or Shift+Wheel is used
    if (Math.abs(e.deltaX) > 4) {
      e.preventDefault();
      markInteracted();
      const delta = e.deltaX * 0.0014;
      targetProgressRef.current = clamp(targetProgressRef.current + delta);
      snapWithFlick(-e.deltaX * 0.01);
    } else if (e.shiftKey && Math.abs(e.deltaY) > 4) {
      e.preventDefault();
      markInteracted();
      const delta = e.deltaY * 0.0014;
      targetProgressRef.current = clamp(targetProgressRef.current + delta);
      snapWithFlick(-e.deltaY * 0.01);
    }
    // If pure vertical scroll without shift key: do NOT preventDefault! Allow normal page scroll downwards.
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

  // Main 60fps/120fps render loop
  useEffect(() => {
    if (!sectionRef.current) return;
    const root = sectionRef.current;
    deviceRef.current = root.querySelector(".fold-phone");
    progressFillRef.current = root.querySelector(".cinema-progress-fill");

    artsBySceneRef.current = scenes.map((_, i) => [
      ...root.querySelectorAll(`.fold-phone-art[data-art="${i}"]`),
    ]);
    captionsRef.current = [...root.querySelectorAll(".cinema-caption")];

    const render = (rawProgress) => {
      const progress = clamp(rawProgress);

      // Unfold phone during the transition from 0.0 to 0.22
      // At 0: phone is folded at ~58deg
      // At 0.22: phone is completely unfolded flat (0deg)
      const unfoldEnd = 0.22;
      const unfoldFraction = clamp(progress / unfoldEnd);
      const open = ease(unfoldFraction);

      // Chapters crossfade between 0.0 and 1.0
      const numChapters = scenes.length;
      const span = progress * (numChapters - 1);
      const chapterIndex = Math.min(numChapters - 1, Math.floor(span));
      const fraction = span - chapterIndex;

      const transitionStart = 0.35;
      let active = chapterIndex;
      let next = chapterIndex;
      let blend = 0;

      if (fraction > transitionStart && chapterIndex < numChapters - 1) {
        next = chapterIndex + 1;
        const blendRaw = (fraction - transitionStart) / (1 - transitionStart);
        blend = ease(blendRaw);
        if (blend >= 0.5) {
          active = next;
        }
      }

      const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
      const maxAngle = isMobile ? 54 : 64;
      const foldAngle = (1 - open) * maxAngle;

      root.style.setProperty("--phone-open", open.toFixed(4));
      root.style.setProperty("--phone-angle", `${foldAngle.toFixed(2)}deg`);
      root.style.setProperty("--phone-scale", (0.88 + open * 0.12).toFixed(4));
      root.style.setProperty("--phone-shift", isMobile ? "0%" : `${(1 - open) * -16}%`);
      root.style.setProperty("--phone-shadow-alpha", (0.32 + open * 0.38).toFixed(4));
      root.style.setProperty("--phone-shadow-scale", (0.72 + open * 0.28).toFixed(4));

      // Layer switching: base is chapterIndex (zIndex 1), incoming is next (zIndex 2)
      for (let i = 0; i < scenes.length; i++) {
        const artList = artsBySceneRef.current[i];
        if (!artList) continue;
        let opacity = 0;
        let zIndex = 0;
        if (i === chapterIndex) {
          opacity = 1;
          zIndex = 1;
        } else if (i === next && blend > 0.01) {
          opacity = blend;
          zIndex = 2;
        }
        for (let j = 0; j < artList.length; j++) {
          artList[j].style.opacity = String(opacity);
          artList[j].style.zIndex = String(zIndex);
        }
      }

      // Update captions and React state only when active chapter changes
      if (active !== lastActiveRef.current) {
        captionsRef.current.forEach((caption, index) => {
          const visible = index === active;
          caption.style.opacity = visible ? "1" : "0";
          caption.style.visibility = visible ? "visible" : "hidden";
        });
        lastActiveRef.current = active;
        setActiveIndex(active);
      }

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${progress})`;
      }

      if (deviceRef.current) {
        const state = open > 0.94 ? "open" : open < 0.04 ? "closed" : "opening";
        if (deviceRef.current.dataset.state !== state) {
          deviceRef.current.dataset.state = state;
        }
      }
    };

    // Initial render
    render(0);

    // Animation frame loop with smooth lerp
    let animationFrameId;
    const lerpFactor = 0.14;

    const loop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0003 || isTouchActiveRef.current || isMouseDraggingRef.current) {
        currentProgressRef.current += diff * lerpFactor;
        render(currentProgressRef.current);
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    // Subtle teaser nudge after 800ms to invite side exploration if user has not interacted
    const teaserTimer = setTimeout(() => {
      if (!hasInteractedRef.current && targetProgressRef.current === 0) {
        targetProgressRef.current = 0.07;
        setTimeout(() => {
          if (!hasInteractedRef.current && targetProgressRef.current === 0.07) {
            targetProgressRef.current = 0;
          }
        }, 750);
      }
    }, 900);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(teaserTimer);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className={`cinema-story is-animated is-side-scroll ${isDragging ? "is-dragging" : ""}`}
      aria-label="SKY DEMAC interactive folding showcase"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
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
          aria-label="Previous chapter (fold phone)"
          title="Previous chapter"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          className={`hero-side-btn hero-side-btn-next ${activeIndex === scenes.length - 1 ? "is-disabled" : ""}`}
          onClick={handleNext}
          disabled={activeIndex === scenes.length - 1}
          aria-label="Next chapter (unfold phone)"
          title="Next chapter"
        >
          <ChevronRight size={22} />
          {activeIndex === 0 && <span className="side-btn-pulse-wave" aria-hidden="true" />}
        </button>

        {/* Authentic iPhone Fold Showcase */}
        <div className="fold-phone" data-state="closed" aria-label="A folding phone opens to reveal automotive work">
          <div className="fold-phone-panel fold-phone-left">
            <div className="fold-phone-screen">
              <PanelArt side="left" />
            </div>
            <span className="fold-phone-speaker" aria-hidden="true" />
            <span className="fold-phone-button fold-phone-button-left" aria-hidden="true" />
          </div>

          <div className="fold-phone-panel fold-phone-right">
            <div className="fold-phone-screen">
              <PanelArt side="right" />
            </div>
            <span className="fold-phone-camera" aria-hidden="true" />
            <span className="fold-phone-button fold-phone-button-right" aria-hidden="true" />
          </div>

          <span className="fold-phone-floor-shadow" aria-hidden="true" />
        </div>

        {/* Captions positioned with modern typography */}
        <div className="cinema-copy-layer">
          {scenes.map((scene, index) => (
            <div
              className={`cinema-caption cinema-caption-${index % 2 === 0 ? "left" : "right"}`}
              data-scene={index}
              key={scene.id}
              aria-hidden={activeIndex !== index}
              inert={activeIndex !== index ? "" : undefined}
            >
              <Caption index={index} />
            </div>
          ))}
        </div>

        {/* Prominent Side-Scroll Indication for Mobile & Desktop */}
        <div
          className={`hero-side-scroll-hint ${hasInteracted ? "is-subtle" : ""}`}
          onClick={handleNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleNext(); }}
          aria-label="Swipe or drag sideways to explore chapters"
        >
          <div className="hint-pill">
            <span className="hint-chevron hint-chevron-left" aria-hidden="true">
              <ChevronLeft size={15} />
            </span>
            <span className="hint-icon-wrap" aria-hidden="true">
              <svg className="hint-swipe-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-4 0v5" />
                <path d="M14 10V4a2 2 0 0 0-4 0v7" />
                <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
                <path d="M18 8a2 2 0 0 1 4 4v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 17" />
              </svg>
            </span>
            <span className="hint-label">
              <span className="hint-label-mobile">SWIPE SIDEWAYS TO EXPLORE</span>
              <span className="hint-label-desktop">DRAG OR SCROLL SIDEWAYS TO EXPLORE</span>
            </span>
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
          <span className="cinema-progress-fill" style={{ transform: `scaleX(${(activeIndex + 1) / scenes.length})` }} />
        </div>
      </div>
    </section>
  );
}
