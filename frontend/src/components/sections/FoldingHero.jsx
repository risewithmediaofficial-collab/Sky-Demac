import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { isServiceActive } from "../../config";
import SafeImage from "../common/SafeImage";

const protectionEnabled = ["ppf", "ceramic-coating", "specialised-coating"].some(isServiceActive);
const scenes = [
  { id: "opening", label: "The opening", eyebrow: "PRECISION ENGINEERING.", copy: "Bespoke automotive care. Masterful precision.", image: "/images/ford-mustang-gt.jpg" },
  { id: "mechanical", label: "Mechanical care", eyebrow: "02 / MECHANICAL CARE", title: "Precision in every service.", copy: "A closer look. A clearer understanding.", image: "/images/dodge-challenger-workshop.jpg" },
  { id: "detailing", label: "The finer details", eyebrow: "03 / THE FINER DETAILS", title: "Every detail. Refined.", copy: "A considered approach to every surface.", image: "/images/ferrari-red-studio.jpg" },
  { id: "exterior", label: protectionEnabled ? "Paint protection" : "Exterior care", eyebrow: protectionEnabled ? "04 / PAINT PROTECTION" : "04 / EXTERIOR CARE", title: protectionEnabled ? "Protect every finish." : "Care for every curve.", copy: protectionEnabled ? "An illustrative study in surface protection." : "Thoughtful care, down to the finish.", image: "/images/mustang-track-red.jpg" },
  { id: "complete", label: "Complete care", eyebrow: "05 / COMPLETE AUTOMOTIVE CARE", title: "Complete care. One destination.", copy: "For the everyday drive. And everything that drives you.", image: "/images/ferrari-red-action.jpg" },
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
          <span style={{ color: "#ffffff" }}>ENGINEERED FOR</span>
          <span className="accent-text" style={{ color: "#e31e24" }}>PERFORMANCE.</span>
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
  const requestLoopRef = useRef(null);

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
    requestLoopRef.current?.();
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
      requestLoopRef.current?.();
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
    requestLoopRef.current?.();
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
    requestLoopRef.current?.();
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
      requestLoopRef.current?.();
    } else if (e.shiftKey && Math.abs(e.deltaY) > 4) {
      e.preventDefault();
      markInteracted();
      const delta = e.deltaY * 0.0014;
      targetProgressRef.current = clamp(targetProgressRef.current + delta);
      snapWithFlick(-e.deltaY * 0.01);
      requestLoopRef.current?.();
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

      // Unfold phone during the initial opening (progress 0.0 to 0.20)
      const unfoldEnd = 0.20;
      const unfoldFraction = clamp(progress / unfoldEnd);
      const initialOpen = ease(unfoldFraction);

      // Chapters transition
      const numChapters = scenes.length;
      const span = progress * (numChapters - 1);
      const chapterIndex = Math.min(numChapters - 1, Math.floor(span));
      const fraction = span - chapterIndex;

      let active = chapterIndex;
      let next = chapterIndex;
      let blend = 0;
      let foldFactor = 0;

      if (fraction > 0.001 && chapterIndex < numChapters - 1) {
        next = chapterIndex + 1;
        blend = ease(fraction);
        if (fraction >= 0.5) {
          active = next;
        }
        // Center fold factor peaks at 1.0 midway through each transition
        foldFactor = Math.sin(fraction * Math.PI);
      }

      const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
      const maxInitialAngle = isMobile ? 54 : 64;
      const baseLeftAngle = (1 - initialOpen) * maxInitialAngle;

      // Authentic iPhone fold from the center crease:
      // When changing, left and right panels fold symmetrically inward from center by up to 44deg!
      const centerFoldAngle = foldFactor * (isMobile ? 36 : 44);
      const totalLeftAngle = baseLeftAngle + centerFoldAngle;
      const totalRightAngle = -centerFoldAngle;

      // Motion blur during the center fold - bypassed on touch/mobile devices for 60fps performance
      const isTouchOrCoarse =
        typeof window !== "undefined" &&
        (window.innerWidth <= 900 ||
          window.matchMedia("(pointer: coarse)").matches);
      const foldBlur = isTouchOrCoarse ? 0 : foldFactor * 16;

      const phoneScale = (0.88 + initialOpen * 0.12 - foldFactor * 0.05).toFixed(4);
      const phoneShift = isMobile ? "0%" : `${((1 - initialOpen) * -16).toFixed(2)}%`;
      const shadowAlpha = (0.32 + initialOpen * 0.38 + foldFactor * 0.22).toFixed(4);
      const shadowScale = (0.72 + initialOpen * 0.28).toFixed(4);

      root.style.setProperty("--phone-open", initialOpen.toFixed(4));
      root.style.setProperty("--phone-angle", `${totalLeftAngle.toFixed(2)}deg`);
      root.style.setProperty("--phone-left-angle", `${totalLeftAngle.toFixed(2)}deg`);
      root.style.setProperty("--phone-right-angle", `${totalRightAngle.toFixed(2)}deg`);
      root.style.setProperty("--phone-crease-opacity", (foldFactor * 0.85).toFixed(3));
      root.style.setProperty("--phone-scale", phoneScale);
      root.style.setProperty("--phone-shift", phoneShift);
      root.style.setProperty("--phone-shadow-alpha", shadowAlpha);
      root.style.setProperty("--phone-shadow-scale", shadowScale);

      // Layer switching with Center Fold & Blur animation
      for (let i = 0; i < scenes.length; i++) {
        const artList = artsBySceneRef.current[i];
        if (!artList) continue;

        let opacity = 0;
        let zIndex = 0;
        let blur = 0;

        if (fraction > 0.001 && chapterIndex < numChapters - 1) {
          if (i === chapterIndex) {
            // Outgoing scene: fades out as it folds into center
            opacity = Math.max(0, 1 - blend * 1.3);
            zIndex = 1;
            blur = foldBlur;
          } else if (i === next) {
            // Incoming scene: reveals as it unfolds from center
            opacity = clamp(blend * 1.4);
            zIndex = 2;
            blur = foldBlur;
          }
        } else if (i === active) {
          // Settled active scene: sharp and pristine
          opacity = 1;
          zIndex = 2;
          blur = 0;
        }

        for (let j = 0; j < artList.length; j++) {
          artList[j].style.opacity = String(opacity);
          artList[j].style.zIndex = String(zIndex);
          artList[j].style.transform = "";
          artList[j].style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
        }
      }

      // Update captions: clean, rock-solid opacity fade (no flip on text)
      if (active !== lastActiveRef.current) {
        captionsRef.current.forEach((caption, index) => {
          const visible = index === active;
          caption.classList.toggle("is-active", visible);
          caption.setAttribute("aria-hidden", String(!visible));
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

    // Animation frame loop with smooth lerp & dormant-when-settled behavior
    let animationFrameId = null;
    let isLooping = false;
    let isVisible = true;
    const lerpFactor = 0.14;

    const loop = () => {
      if (!isVisible) {
        isLooping = false;
        return;
      }

      const diff = targetProgressRef.current - currentProgressRef.current;
      const isInteracting = isTouchActiveRef.current || isMouseDraggingRef.current;

      if (Math.abs(diff) > 0.0002 || isInteracting) {
        currentProgressRef.current += diff * lerpFactor;
        render(currentProgressRef.current);
        animationFrameId = requestAnimationFrame(loop);
      } else {
        currentProgressRef.current = targetProgressRef.current;
        render(currentProgressRef.current);
        isLooping = false;
      }
    };

    const requestLoop = () => {
      if (!isLooping && isVisible) {
        isLooping = true;
        animationFrameId = requestAnimationFrame(loop);
      }
    };
    requestLoopRef.current = requestLoop;

    // IntersectionObserver to pause loop completely when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          requestLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(root);

    requestLoop();

    // Subtle teaser nudge after 800ms to invite side exploration if user has not interacted
    const teaserTimer = setTimeout(() => {
      if (!hasInteractedRef.current && targetProgressRef.current === 0) {
        targetProgressRef.current = 0.07;
        requestLoop();
        setTimeout(() => {
          if (!hasInteractedRef.current && targetProgressRef.current === 0.07) {
            targetProgressRef.current = 0;
            requestLoop();
          }
        }, 750);
      }
    }, 900);

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      clearTimeout(teaserTimer);
      requestLoopRef.current = null;
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
              className={`cinema-caption cinema-caption-${index % 2 === 0 ? "left" : "right"} ${activeIndex === index ? "is-active" : ""}`}
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
            <div className="hint-label-stack">
              <span className="hint-label">
                <span className="hint-label-mobile">SWIPE SIDEWAYS TO EXPLORE</span>
                <span className="hint-label-desktop">DRAG OR SCROLL SIDEWAYS TO EXPLORE</span>
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
          <span className="cinema-progress-fill" style={{ transform: `scaleX(${(activeIndex + 1) / scenes.length})` }} />
        </div>
      </div>
    </section>
  );
}
