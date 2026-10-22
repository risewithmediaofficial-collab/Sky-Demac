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
function needsStaticExperience() {
  const device = navigator;
  return matchMedia("(prefers-reduced-motion: reduce)").matches || !!device.connection?.saveData || !!(device.deviceMemory && device.deviceMemory < 4);
}

function PanelArt({ side }) {
  return <div className="fold-phone-art-stack" aria-hidden="true">
    {scenes.map((scene, index) => <div className="fold-phone-art" data-art={index} key={`${side}-${scene.id}`}>
      <SafeImage src={scene.image} className={`fold-phone-image fold-phone-image-${side}`} alt="" width="1805" height="871" fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
    </div>)}
  </div>;
}

function Caption({ index }) {
  const scene = scenes[index];
  return <div className="caption-plain">
    <div className="eyebrow red-eyebrow"><span />{scene.eyebrow}</div>
    {index === 0 ? <h1>Built for the Pressure<span>.</span></h1> : <h2>{scene.title}</h2>}
    <p className="cinema-support">{scene.copy}</p>
    <div className="cinema-actions">
      <Link to={index === 0 ? "/services" : "/contact"} className="button button-primary">{index === 0 ? "Explore Services" : "Book a Service"}<ArrowUpRight size={17} /></Link>
      <Link to={index === 0 ? "/contact" : "/services"} className="cinema-secondary">{index === 0 ? "Enquire About a Service" : "Explore Services"}<ChevronRight size={15} /></Link>
    </div>
  </div>;
}

export default function FoldingHero() {
  const sectionRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  const [staticExperience, setStaticExperience] = useState(needsStaticExperience);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let disposed = false;
    let cleanup;
    if (needsStaticExperience()) return undefined;

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
        const open = ease(progress / 0.24);
        const story = clamp((progress - 0.2) / 0.8);
        const chapterPosition = story * scenes.length;
        const active = Math.min(scenes.length - 1, Math.floor(chapterPosition));
        const local = chapterPosition - active;
        const next = Math.min(scenes.length - 1, active + 1);
        const blend = active === next ? 0 : ease(clamp((local - 0.68) / 0.32));

        root.style.setProperty("--phone-open", open.toFixed(4));
        root.style.setProperty("--phone-angle", `${178 - open * 178}deg`);
        root.style.setProperty("--phone-blur", `${(1 - open) * 14}px`);
        root.style.setProperty("--phone-scale", (0.76 + open * 0.24).toFixed(4));
        root.style.setProperty("--phone-shift", `${(1 - open) * -25}%`);
        root.style.setProperty("--phone-glare", (0.72 - open * 0.5).toFixed(4));
        root.style.setProperty("--phone-shadow-alpha", (0.28 + open * 0.42).toFixed(4));
        root.style.setProperty("--phone-shadow-scale", (0.64 + open * 0.36).toFixed(4));
        root.style.setProperty("--hero-copy-in", (0.88 + open * 0.12).toFixed(4));

        arts.forEach((art) => {
          const index = Number(art.dataset.art);
          let opacity = index === active ? 1 - blend : 0;
          if (index === next) opacity = Math.max(opacity, blend);
          art.style.opacity = String(opacity);
          art.style.transform = `scale(${1.035 + (1 - opacity) * 0.025})`;
        });
        captions.forEach((caption, index) => {
          const visible = index === active;
          caption.style.opacity = visible ? "1" : "0";
          caption.style.visibility = visible ? "visible" : "hidden";
        });
        if (active !== lastActive) { lastActive = active; setActiveIndex(active); }
        progressFill.style.transform = `scaleX(${progress})`;
        device.dataset.state = open > 0.98 ? "open" : open < 0.04 ? "closed" : "opening";
      };

      setAnimated(true);
      setStaticExperience(false);
      render(0);
      const cursor = { progress: 0 };
      const timeline = gsap.timeline({
        scrollTrigger: { id: "sky-fold-open", trigger: root, start: "top top", pin: stage, end: () => `+=${stage.clientHeight * 4.8}`, scrub: 0.55, anticipatePin: 1, invalidateOnRefresh: true },
        onUpdate: () => render(cursor.progress),
      });
      timeline.to(cursor, { progress: 1, duration: 1, ease: "none" });
      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refresh);
      window.addEventListener("resize", refresh);
      cleanup = () => { window.removeEventListener("resize", refresh); timeline.scrollTrigger?.kill(); timeline.kill(); };
    }).catch(() => { if (!disposed) setStaticExperience(true); });

    return () => { disposed = true; cleanup?.(); };
  }, []);

  return <section id="home" ref={sectionRef} className={`cinema-story ${animated ? "is-animated" : ""} ${staticExperience ? "is-static" : ""}`} aria-label="SKY DEMAC automotive story">
    <div className="cinema-stage">
      <div className="hero-ambient hero-ambient-one" aria-hidden="true" />
      <div className="hero-ambient hero-ambient-two" aria-hidden="true" />
      <div className="fold-phone" data-state="closed" aria-label="A folding phone opens to reveal automotive work">
        <div className="fold-phone-panel fold-phone-left">
          <div className="fold-phone-screen"><PanelArt side="left" /><span className="fold-phone-glare" /></div>
          <span className="fold-phone-speaker" /><span className="fold-phone-button fold-phone-button-left" />
        </div>
        <div className="fold-phone-panel fold-phone-right">
          <div className="fold-phone-screen"><PanelArt side="right" /><span className="fold-phone-glare" /></div>
          <span className="fold-phone-camera" /><span className="fold-phone-button fold-phone-button-right" />
        </div>
        <span className="fold-phone-hinge" aria-hidden="true" /><span className="fold-phone-floor-shadow" aria-hidden="true" />
      </div>
      <div className="cinema-copy-layer">
        {scenes.map((scene, index) => <div className={`cinema-caption cinema-caption-${index % 2 === 0 ? "left" : "right"}`} data-scene={index} key={scene.id} aria-hidden={activeIndex !== index} inert={activeIndex !== index}><Caption index={index} /></div>)}
      </div>
      <div className="cinema-bottom">
        <a className="cinema-skip" href="#services">Skip animation <ArrowDown size={14} /></a>
        <div className="cinema-chapter"><span className="cinema-chapter-number">0{activeIndex + 1}</span><span className="cinema-chapter-line" /><span>{scenes[activeIndex].label}</span><span className="cinema-chapter-total">/ 05</span></div>
        <span className="cinema-disclosure">Scroll to unfold · Crafted in motion</span>
      </div>
      <div className="cinema-progress" aria-hidden="true"><span className="cinema-progress-fill" /></div>
    </div>
    {staticExperience && <div className="cinema-static-chapters">{scenes.slice(1).map((scene, offset) => <div className="cinema-static-scene" key={scene.id}><SafeImage src={scene.image} alt="" width="1200" height="800" /><Caption index={offset + 1} /></div>)}</div>}
  </section>;
}
