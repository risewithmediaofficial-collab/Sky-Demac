import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
const ease = (value) => { const n = clamp(value); return n * n * (3 - 2 * n); };

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
  const [animated, setAnimated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChapterClick = (idx) => {
    setActiveIndex(idx);
    if (sectionRef.current) {
      const stage = sectionRef.current.querySelector(".cinema-stage");
      const isMobile = window.innerWidth <= 768;
      const multiplier = isMobile ? 3.0 : 3.5;
      const pinDistance = (stage?.clientHeight || window.innerHeight) * multiplier;
      const unfoldEnd = 0.22;
      const storyEnd = 0.85;
      const chapterTarget = idx / (scenes.length - 1);
      const targetScroll =
        sectionRef.current.offsetTop +
        unfoldEnd * pinDistance +
        chapterTarget * ((storyEnd - unfoldEnd) * pinDistance);

      if (window.__lenis) {
        window.__lenis.scrollTo(targetScroll, { duration: 0.9 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const root = sectionRef.current;
    const stage = root.querySelector(".cinema-stage");
    const device = root.querySelector(".fold-phone");
    const progressFill = root.querySelector(".cinema-progress-fill");

    // Group art images by scene index for fast batch updates
    const artsByScene = scenes.map((_, i) => [
      ...root.querySelectorAll(`.fold-phone-art[data-art="${i}"]`),
    ]);
    const captions = [...root.querySelectorAll(".cinema-caption")];
    let lastActive = -1;

    const render = (rawProgress) => {
      const progress = clamp(rawProgress);

      // 1. Phone unfolds during first 22% of pinned scroll
      const unfoldEnd = 0.22;
      const open = ease(clamp(progress / unfoldEnd));

      // 2. Chapters crossfade between 22% and 85%
      // Leaving 85% to 100% as a locked resting plateau for Chapter 05
      const storyEnd = 0.85;
      const storyProgress = clamp((progress - unfoldEnd) / (storyEnd - unfoldEnd));
      const numChapters = scenes.length;
      const chapterSpan = storyProgress * (numChapters - 1);
      const chapterIndex = Math.min(numChapters - 1, Math.floor(chapterSpan));
      const chapterFraction = chapterSpan - chapterIndex;

      // In each chapter interval:
      // First 45% (0.0 to 0.45) is a rock-solid pure hold of this scene (zero ghosting).
      // Last 55% (0.45 to 1.0) is a smooth crossfade into the next scene.
      const transitionStart = 0.45;
      let active = chapterIndex;
      let next = chapterIndex;
      let blend = 0;

      if (chapterFraction > transitionStart && chapterIndex < numChapters - 1) {
        next = chapterIndex + 1;
        const blendRaw = (chapterFraction - transitionStart) / (1 - transitionStart);
        blend = ease(blendRaw);
        if (blend >= 0.5) {
          active = next;
        }
      }

      const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
      const maxAngle = isMobile ? 60 : 70;
      const foldAngle = (1 - open) * maxAngle;

      root.style.setProperty("--phone-open", open.toFixed(4));
      root.style.setProperty("--phone-angle", `${foldAngle.toFixed(2)}deg`);
      root.style.setProperty("--phone-scale", (0.88 + open * 0.12).toFixed(4));
      root.style.setProperty("--phone-shift", isMobile ? "0%" : `${(1 - open) * -16}%`);
      root.style.setProperty("--phone-shadow-alpha", (0.32 + open * 0.38).toFixed(4));
      root.style.setProperty("--phone-shadow-scale", (0.72 + open * 0.28).toFixed(4));

      // Layer switching: base is chapterIndex (zIndex 1), incoming is next (zIndex 2)
      for (let i = 0; i < scenes.length; i++) {
        const artList = artsByScene[i];
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
      if (active !== lastActive) {
        captions.forEach((caption, index) => {
          const visible = index === active;
          caption.style.opacity = visible ? "1" : "0";
          caption.style.visibility = visible ? "visible" : "hidden";
        });
        lastActive = active;
        setActiveIndex(active);
      }

      if (progressFill) {
        progressFill.style.transform = `scaleX(${progress})`;
      }

      if (device) {
        const state = open > 0.94 ? "open" : open < 0.04 ? "closed" : "opening";
        if (device.dataset.state !== state) {
          device.dataset.state = state;
        }
      }
    };

    setAnimated(true);
    render(0);

    // Pin with ScrollTrigger using synchronous scrub (zero latency delay)
    // Completely solves the bug where below sections scrolled up prematurely!
    const trigger = ScrollTrigger.create({
      id: "sky-fold-open",
      trigger: root,
      start: "top top",
      pin: stage,
      pinSpacing: true,
      end: () => `+=${stage.clientHeight * (window.innerWidth <= 768 ? 3.0 : 3.5)}`,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => render(self.progress),
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      trigger.kill();
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className={`cinema-story ${animated ? "is-animated" : ""}`} aria-label="SKY DEMAC automotive story">
      <div className="cinema-stage">
        <div className="hero-ambient hero-ambient-one" aria-hidden="true" />
        <div className="hero-ambient hero-ambient-two" aria-hidden="true" />

        {/* Authentic iPhone Fold Showcase - Unfolds on Scroll with 100% Blended Screen */}
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

        {/* Chapter Navigation Bar */}
        <div className="cinema-bottom">
          <a className="cinema-skip" href="#services">
            Skip animation <ArrowDown size={14} />
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
                onClick={() => handleChapterClick(idx)}
                aria-label={`Jump to chapter ${idx + 1}: ${s.label}`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="cinema-progress" aria-hidden="true">
          <span className="cinema-progress-fill" style={{ transform: `scaleX(${(activeIndex + 1) / scenes.length})` }} />
        </div>
      </div>
    </section>
  );
}
