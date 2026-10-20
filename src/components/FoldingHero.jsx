import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import { isServiceActive } from "../config";
import SafeImage from "./SafeImage";
const HOLD = 0.11;
const FOLD = 0.1125;
const CYCLE = HOLD + FOLD;
const protectionEnabled = ["ppf", "ceramic-coating", "specialised-coating"].some(isServiceActive);
const scenes = [
    { id: "opening", label: "The opening", eyebrow: "ENGINEERED TO CARE.", title: "Built for the Pressure.", copy: "Complete automotive care. Exceptional attention.", image: "/images/scene-wide.webp", wide: true },
    { id: "mechanical", label: "Mechanical care", eyebrow: "02 / MECHANICAL CARE", title: "Precision in every service.", copy: "A closer look. A clearer understanding.", image: "/images/scene-wheel.webp", wide: false },
    { id: "detailing", label: "The finer details", eyebrow: "03 / THE FINER DETAILS", title: "Every detail. Refined.", copy: "A considered approach to every surface.", image: "/images/scene-detail.webp", wide: false },
    { id: "exterior", label: protectionEnabled ? "Paint protection" : "Exterior care", eyebrow: protectionEnabled ? "04 / PAINT PROTECTION" : "04 / EXTERIOR CARE", title: protectionEnabled ? "Protect every finish." : "Care for every curve.", copy: protectionEnabled ? "An illustrative study in surface protection." : "Thoughtful care, down to the finish.", image: "/images/scene-exterior.webp", wide: false },
    { id: "complete", label: "Complete care", eyebrow: "05 / COMPLETE AUTOMOTIVE CARE", title: "Complete care. One destination.", copy: "For the everyday drive. And everything that drives you.", image: "/images/scene-wide.webp", wide: true },
];
const clamp = (value) => Math.max(0, Math.min(1, value));
function needsStaticExperience() {
    const device = navigator;
    return matchMedia("(prefers-reduced-motion: reduce)").matches || !!device.connection?.saveData || !!(device.deviceMemory && device.deviceMemory < 4);
}
function SceneVisual({ index, main = false }) {
    const scene = scenes[index];
    return <div className={`cinema-image-plane ${scene.wide ? "cinema-wide" : "cinema-close"}`} data-art={index}>
    <SafeImage className={`cinema-scene-image ${main ? "cinema-photo-main" : ""}`} src={scene.image} srcSet={scene.wide ? "/images/scene-wide-mobile.webp 800w, /images/scene-wide.webp 1805w" : undefined} sizes="100vw" width={scene.wide ? 1805 : 1200} height={scene.wide ? 871 : 900} alt="" fetchPriority={main ? "high" : "auto"} decoding="async"/>
    {index === 2 && <div className="cinema-paint-reflection"/>}
    {index === 3 && protectionEnabled && <div className="cinema-protection-layer"/>}
  </div>;
}
function Caption({ index, align }) {
    const scene = scenes[index];
    const isRight = align === "right";
    return (<div className={`caption-plain ${isRight ? "align-right" : "align-left"}`}>
      <div className="eyebrow red-eyebrow">
        <span />
        {scene.eyebrow}
      </div>
      {index === 0 ? (<h1>
          Built for the Pressure<span>.</span>
        </h1>) : (<h2>{scene.title}</h2>)}
      <p className="cinema-support">{scene.copy}</p>
      <div className={`cinema-actions ${isRight ? "actions-right" : "actions-left"}`}>
        {index === 0 ? (
          <>
            <a href="#services" className="button button-primary">
              Explore Services
              <ArrowUpRight size={17}/>
            </a>
            <Link to="/contact" className="cinema-secondary">
              Enquire About a Service
              <ChevronRight size={15}/>
            </Link>
          </>
        ) : (
          <>
            <Link to="/contact" className="button button-primary">
              Book a Service
              <ArrowUpRight size={17}/>
            </Link>
            <Link to="/services" className="cinema-secondary">
              Explore Services
              <ChevronRight size={15}/>
            </Link>
          </>
        )}
      </div>
      {index === 4 && (<p className="cinema-enquiry-note">
          Start with a service enquiry. Availability will be confirmed.
        </p>)}
    </div>);
}
/** Full-viewport scene panels with a real CSS 3D hinge. Car imagery is 2.5D. */
export default function FoldingHero() {
    const sectionRef = useRef(null);
    const [animated, setAnimated] = useState(false);
    const [staticExperience, setStaticExperience] = useState(needsStaticExperience);
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        let disposed = false;
        let cleanup;
        const device = navigator;
        if (device.connection?.saveData || (device.deviceMemory && device.deviceMemory < 4))
            return;
        Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
            if (disposed || !sectionRef.current)
                return;
            gsap.registerPlugin(ScrollTrigger);
            const media = gsap.matchMedia();
            media.add({ desktop: "(min-width: 1000px)", mobile: "(max-width: 999px)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
                const el = sectionRef.current;
                const stage = el.querySelector(".cinema-stage");
                const layers = [...el.querySelectorAll(".cinema-scene")];
                const folds = [...el.querySelectorAll(".cinema-fold")];
                const captions = [...el.querySelectorAll(".cinema-caption")];
                const planes = [...stage.querySelectorAll(".cinema-image-plane")];
                const progressBar = stage.querySelector(".cinema-progress-fill");
                const mobile = !!context.conditions?.mobile;
                let lastChapter = -1;
                // One pure progress mapping drives geometry, crop movement, blur, light and text.
                // No velocity, elapsed time, delayed callbacks or DOM image-source swapping.
                const render = (progress) => {
                    const p = clamp(progress);
                    const outgoing = Math.min(4, Math.floor(p / CYCLE));
                    const local = p - outgoing * CYCLE;
                    const t = outgoing < 4 ? clamp((local - HOLD) / FOLD) : 0;
                    const folding = t > 0 && t < 1;
                    const incoming = Math.min(4, outgoing + 1);
                    const active = t >= .5 ? incoming : outgoing;
                    const underlay = t > 0 ? incoming : outgoing;
                    el.dataset.progress = p.toFixed(6);
                    el.dataset.activeScene = String(active);
                    layers.forEach((layer, index) => { layer.style.visibility = index === underlay ? "visible" : "hidden"; });
                    folds.forEach((fold, index) => {
                        const isCurrent = folding && index === outgoing;
                        fold.style.display = isCurrent ? "block" : "none";
                        if (!isCurrent)
                            return;
                        const angle = t * 180;
                        const intensity = Math.sin(Math.PI * t);
                        fold.dataset.foldProgress = t.toFixed(6);
                        fold.style.setProperty("--fold-angle", `${-angle}deg`);
                        fold.style.setProperty("--fold-blur", `${(mobile ? .6 : 1.5) * intensity * intensity}px`);
                        fold.style.setProperty("--fold-shade", String(intensity * .48));
                        fold.querySelector(".cinema-receiving-shadow").style.opacity = String(intensity * .48);
                    });
                    planes.forEach(plane => {
                        const index = Number(plane.dataset.art);
                        const camera = clamp((p - index * CYCLE) / HOLD);
                        plane.style.setProperty("--camera-scale", String(1 + camera * (mobile ? .009 : .018)));
                        plane.style.setProperty("--camera-x", `${-camera * (mobile ? 1 : 5)}px`);
                        plane.style.setProperty("--camera-y", `${-camera * (mobile ? 1 : 3)}px`);
                        plane.style.setProperty("--reflection-x", `${-105 + camera * 210}%`);
                        plane.style.setProperty("--reflection-alpha", String(Math.sin(camera * Math.PI) * .13));
                        plane.style.setProperty("--protection-alpha", String(.06 + camera * .04));
                    });
                    captions.forEach((caption, index) => {
                        let opacity = index === active ? 1 : 0;
                        if (folding) {
                            if (index === outgoing)
                                opacity = 1 - clamp((t - .28) / .2);
                            else if (index === incoming)
                                opacity = clamp((t - .52) / .2);
                        }
                        caption.style.opacity = String(opacity);
                        caption.style.visibility = opacity > 0 ? "visible" : "hidden";
                    });
                    if (active !== lastChapter) {
                        lastChapter = active;
                        setActiveIndex(active);
                    }
                    progressBar.style.transform = `scaleX(${p})`;
                };
                if (context.conditions?.reduced) {
                    render(0);
                    setAnimated(false);
                    setStaticExperience(true);
                    return;
                }
                setAnimated(true);
                setStaticExperience(false);
                render(0);
                const cursor = { progress: 0 };
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        id: "sky-fullscreen-fold", trigger: el, start: "top top", pin: stage,
                        end: () => `+=${stage.clientHeight * (mobile ? 2.6 : 4.5)}`,
                        scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
                    },
                    onUpdate: () => render(cursor.progress),
                });
                timeline.to(cursor, { progress: 1, duration: 1, ease: "none" });
                const refresh = () => { if (!disposed)
                    ScrollTrigger.refresh(); };
                document.fonts.ready.then(refresh);
                window.addEventListener("resize", refresh);
                return () => {
                    window.removeEventListener("resize", refresh);
                    render(0);
                    setAnimated(false);
                };
            }, sectionRef);
            cleanup = () => media.revert();
        }).catch(() => { if (!disposed)
            setStaticExperience(true); });
        return () => { disposed = true; cleanup?.(); };
    }, []);
    const skipAnimation = () => {
        // Keep this a native anchor; move keyboard focus to the destination after navigation.
        requestAnimationFrame(() => {
            const target = document.getElementById("services");
            if (target) {
                target.tabIndex = -1;
                target.focus({ preventScroll: true });
            }
        });
    };
    return (<section id="home" ref={sectionRef} className={`cinema-story ${animated ? "is-animated" : ""} ${staticExperience ? "is-static" : ""}`} aria-label="The SKY DEMAC automotive story" data-progress="0">
      <div className="cinema-stage">
        {/* iPhone Fold Showcase Container (Exact Image 2 Template) */}
        <div className="iphone-template-showcase">
          {/* Inner Folding Screen - Fitted precisely inside the template frame's screen window */}
          <div className="iphone-template-screen">
            <div className="cinema-backdrop" aria-hidden="true">
              {scenes.map((scene, index) => (<div key={scene.id} className="cinema-scene" data-scene={index} style={{ visibility: index === 0 ? "visible" : "hidden" }}>
                  <SceneVisual index={index} main={index === 0}/>
                </div>))}
            </div>

            <div className="cinema-depth" aria-hidden="true">
              {scenes.slice(0, -1).map((scene, index) => (<div className="cinema-fold" key={scene.id} data-transition={index}>
                  <div className="cinema-stationary cinema-slice cinema-slice-left">
                    <SceneVisual index={index}/>
                  </div>
                  <div className="cinema-receiving-shadow"/>
                  <div className="cinema-flap">
                    <div className="cinema-face cinema-face-front cinema-slice cinema-slice-right">
                      <SceneVisual index={index}/>
                      <div className="cinema-face-tint"/>
                    </div>
                    <div className="cinema-face cinema-face-back cinema-slice cinema-slice-left">
                      <SceneVisual index={index + 1}/>
                      <div className="cinema-face-tint"/>
                    </div>
                  </div>
                </div>))}
            </div>

            <div className="cinema-readability" aria-hidden="true"/>
          </div>

          {/* iPhone Fold Frame Overlay (Image 2 with Transparent Screen Cutout) */}
          <img src="/images/iphone-fold-template-overlay.webp" alt="iPhone Fold presentation template" className="iphone-template-overlay-img" aria-hidden="true"/>
        </div>


        {/* Zig-Zag Alternating Plain Captions (Left & Right) */}
        <div className="cinema-copy-layer">
          {scenes.map((scene, index) => {
            const align = index % 2 === 0 ? "left" : "right";
            return (<div className={`cinema-caption ${index === 0 ? "cinema-first-caption" : ""} cinema-caption-${align}`} data-scene={index} data-align={align} key={scene.id} aria-hidden={activeIndex !== index} inert={activeIndex !== index}>
                <Caption index={index} align={align}/>
              </div>);
        })}
        </div>

        {/* Bottom Bar: Skip, Chapter Indicators, Progress */}
        <div className="cinema-bottom">
          <a className="cinema-skip" href="#services" onClick={skipAnimation}>
            Skip animation <ArrowDown size={14}/>
          </a>
          <div className="cinema-chapter">
            <span className="cinema-chapter-number">0{activeIndex + 1}</span>
            <span className="cinema-chapter-line"/>
            <span>{scenes[activeIndex].label}</span>
            <span className="cinema-chapter-total">/ 05</span>
          </div>
          <span className="cinema-disclosure">
            iPhone Fold Presentation · 2.5D Automotive Story
          </span>
        </div>
        <div className="cinema-progress" aria-hidden="true">
          <span className="cinema-progress-fill"/>
        </div>
      </div>

      {/* Reduced-motion / Static Experience */}
      {staticExperience && (<div className="cinema-static-chapters">
          {scenes.slice(1).map((scene, offset) => {
                const align = (offset + 1) % 2 === 0 ? "left" : "right";
                return (<div className="cinema-static-scene" key={scene.id}>
                <div className="cinema-static-visual" aria-hidden="true">
                  <SceneVisual index={offset + 1}/>
                </div>
                <div className="cinema-readability" aria-hidden="true"/>
                <div className={`cinema-static-copy cinema-static-${align}`}>
                  <Caption index={offset + 1} align={align}/>
                </div>
                <span className="cinema-static-disclosure">
                  Illustrative imagery · {scene.label}
                </span>
              </div>);
            })}
        </div>)}
    </section>);
}
