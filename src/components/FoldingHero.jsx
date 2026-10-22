import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import { isServiceActive } from "../config";
import SafeImage from "./SafeImage";

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
          Enquire About a Service <ChevronRight size={14} />
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
      const multiplier = isMobile ? 1.8 : 2.4;
      const pinDistance = (stage?.clientHeight || window.innerHeight) * multiplier;
      const unfoldEnd = 0.3;
      const targetScroll = sectionRef.current.offsetTop + unfoldEnd * pinDistance + (idx / (scenes.length - 1)) * (pinDistance * (1 - unfoldEnd));
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let disposed = false;
    let cleanup;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const root = sectionRef.current;
      const stage = root.querySelector(".cinema-stage");
      const device = root.querySelector(".fold-phone");
      const arts = [...root.querySelectorAll(".fold-phone-art")];
      const captions = [...root.querySelectorAll(".cinema-caption")];
      const progressFill = root.querySelector(".cinema-progress-fill");
      let lastActive = -1;

      const render = (rawProgress) => {
        const progress = clamp(rawProgress);
        // Unfolding completes during first 30% of scroll
        const unfoldEnd = 0.3;
        const open = ease(clamp(progress / unfoldEnd));
        
        // Chapter crossfades start ONLY after phone is open
        const storyProgress = clamp((progress - unfoldEnd) / (1 - unfoldEnd));
        const chapterPosition = storyProgress * (scenes.length - 1);
        const active = Math.min(scenes.length - 1, Math.floor(chapterPosition));
        const local = chapterPosition - active;
        const next = Math.min(scenes.length - 1, active + 1);
        const blend = active === next ? 0 : ease(local);

        const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
        const maxAngle = isMobile ? 60 : 70;
        const foldAngle = (1 - open) * maxAngle;

        root.style.setProperty("--phone-open", open.toFixed(4));
        root.style.setProperty("--phone-angle", `${foldAngle.toFixed(2)}deg`);
        root.style.setProperty("--phone-blur", `${(1 - open) * 4}px`);
        root.style.setProperty("--phone-scale", (0.88 + open * 0.12).toFixed(4));
        root.style.setProperty("--phone-shift", isMobile ? "0%" : `${(1 - open) * -16}%`);
        root.style.setProperty("--phone-glare", (0.35 - open * 0.35).toFixed(4));
        root.style.setProperty("--phone-shadow-alpha", (0.32 + open * 0.38).toFixed(4));
        root.style.setProperty("--phone-shadow-scale", (0.72 + open * 0.28).toFixed(4));
        root.style.setProperty("--hero-copy-in", (0.9 + open * 0.1).toFixed(4));

        arts.forEach((art) => {
          const index = Number(art.dataset.art);
          let opacity = index === active ? 1 - blend : 0;
          if (index === next) opacity = Math.max(opacity, blend);
          art.style.opacity = String(opacity);
        });

        captions.forEach((caption, index) => {
          const visible = index === active;
          caption.style.opacity = visible ? "1" : "0";
          caption.style.visibility = visible ? "visible" : "hidden";
        });

        if (active !== lastActive) {
          lastActive = active;
          setActiveIndex(active);
        }
        if (progressFill) {
          progressFill.style.transform = `scaleX(${progress})`;
        }
        if (device) {
          device.dataset.state = open > 0.94 ? "open" : open < 0.04 ? "closed" : "opening";
        }
      };

      setAnimated(true);
      render(0);
      const cursor = { progress: 0 };
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "sky-fold-open",
          trigger: root,
          start: "top top",
          pin: stage,
          end: () => `+=${stage.clientHeight * (window.innerWidth <= 768 ? 1.8 : 2.4)}`,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => render(cursor.progress),
      });
      timeline.to(cursor, { progress: 1, duration: 1, ease: "none" });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refresh);
      window.addEventListener("resize", refresh);
      cleanup = () => {
        window.removeEventListener("resize", refresh);
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    }).catch(() => {
      setAnimated(true);
    });

    return () => {
      disposed = true;
      cleanup?.();
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
