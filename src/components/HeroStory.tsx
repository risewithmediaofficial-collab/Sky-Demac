import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight } from "lucide-react";
import SafeImage from "./SafeImage";

const chapters = [
  "The reveal",
  "Mechanical precision",
  "The finer details",
  "Exterior care",
  "Complete care",
];

export default function HeroStory() {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    let disposed = false;
    let revert: (() => void) | undefined;
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (
      device.connection?.saveData ||
      (device.deviceMemory && device.deviceMemory < 4)
    )
      return;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add(
          "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
          () => {
            const el = root.current!;
            const stage = el.querySelector(".story-stage")!;
            const images = el.querySelectorAll(".story-photo");
            const panels = el.querySelectorAll(".story-copy");
            setAnimated(true);
            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: () => `+=${window.innerHeight * 4}`,
                pin: stage,
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) =>
                  setChapter(Math.min(4, Math.floor(self.progress * 5))),
              },
            });
            gsap.set(panels, { autoAlpha: 0, yPercent: -44, y: 0 });
            gsap.set(panels[0], { autoAlpha: 1 });
            timeline.to({}, { duration: 1 }, 0);
            for (let i = 1; i < 5; i++) {
              const at = i * 0.2 - 0.035;
              timeline.to(
                panels[i - 1],
                { autoAlpha: 0, y: -14, duration: 0.03 },
                at,
              );
              timeline.fromTo(
                panels[i],
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, duration: 0.04 },
                at + 0.03,
              );
            }
            timeline.to(
              images[0],
              { scale: 1.18, xPercent: -8, duration: 0.16 },
              0.18,
            );
            timeline.to(images[1], { opacity: 1, duration: 0.04 }, 0.37);
            timeline.fromTo(
              images[1],
              { scale: 1.03, filter: "saturate(0.2) brightness(0.55)" },
              {
                scale: 1,
                filter: "saturate(0.75) brightness(1)",
                duration: 0.16,
              },
              0.4,
            );
            timeline.to(images[2], { opacity: 1, duration: 0.05 }, 0.57);
            timeline.to(
              stage,
              { backgroundColor: "#f2f3f4", color: "#17191d", duration: 0.07 },
              0.78,
            );
            timeline.to(
              el.querySelector(".story-shade"),
              { opacity: 0, duration: 0.07 },
              0.78,
            );
            timeline.to(images, { opacity: 0, duration: 0.05 }, 0.78);
            timeline.to(
              images[0],
              {
                opacity: 1,
                scale: 0.94,
                xPercent: 0,
                clipPath: "inset(15% 3% 15% 49% round 12px)",
                duration: 0.08,
              },
              0.83,
            );
            timeline.to(
              el.querySelector(".story-progress-fill"),
              { scaleX: 1, duration: 1 },
              0,
            );
            return () => {
              setAnimated(false);
              setChapter(0);
            };
          },
          root,
        );
        revert = () => media.revert();
      })
      .catch(() => {
        /* The complete static hero remains usable if motion cannot load. */
      });
    return () => {
      disposed = true;
      revert?.();
    };
  }, []);

  return (
    <section
      id="home"
      className={`hero-story ${animated ? "is-animated" : ""}`}
      ref={root}
      aria-label="An introduction to SKY DEMAC"
    >
      <div className="story-stage">
        <div className="story-visual" aria-hidden="true">
          <SafeImage
            className="story-photo story-photo-main"
            src="/images/hero.webp"
            srcSet="/images/hero-mobile.webp 800w, /images/hero.webp 1805w"
            sizes="100vw"
            width="1805"
            height="871"
            alt=""
            fetchPriority="high"
          />
          <SafeImage
            className="story-photo story-photo-detail"
            src="/images/detailing.webp"
            width="1200"
            height="900"
            alt=""
            loading="lazy"
          />
          <SafeImage
            className="story-photo story-photo-exterior"
            src="/images/exterior.webp"
            width="1200"
            height="900"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="story-shade" />
        <div className="story-content wrap">
          <div
            className="story-copy first-story"
            aria-hidden={chapter !== 0}
            inert={chapter !== 0}
          >
            <div className="eyebrow light">
              <span /> ENGINEERED TO CARE.
            </div>
            <h1>
              Built for
              <br />
              the Pressure<span className="blue-period">.</span>
            </h1>
            <p className="hero-support">Complete care. Remarkable finish.</p>
            <p className="hero-description">
              For the everyday drive.
              <br />
              And everything that drives you.
            </p>
            <div className="hero-actions">
              <a href="#services" className="button button-primary">
                Explore Services <ArrowUpRight size={17} />
              </a>
              <a href="#contact" className="hero-enquire">
                Enquire About a Service <ChevronRight size={16} />
              </a>
            </div>
          </div>
          <div
            className="story-copy"
            aria-hidden={chapter !== 1}
            inert={chapter !== 1}
          >
            <div className="eyebrow light">02 / MECHANICAL PRECISION</div>
            <h2>
              Precision in
              <br />
              every service.
            </h2>
            <p className="hero-support">
              A closer look. A clearer understanding.
            </p>
            <div className="story-tags">
              <span>Diagnostics</span>
              <span>Brakes</span>
              <span>Periodic maintenance</span>
            </div>
            <p className="visual-note">
              Care concepts · availability to be confirmed
            </p>
          </div>
          <div
            className="story-copy"
            aria-hidden={chapter !== 2}
            inert={chapter !== 2}
          >
            <div className="eyebrow light">03 / THE FINER DETAILS</div>
            <h2>
              Bring back
              <br />
              the brilliance.
            </h2>
            <p className="hero-support">The difference is in the details.</p>
            <div className="story-tags">
              <span>Paint correction</span>
              <span>Interior care</span>
              <span>Premium detailing</span>
            </div>
            <p className="visual-note">
              Illustrative finish transition · not a customer result
            </p>
          </div>
          <div
            className="story-copy"
            aria-hidden={chapter !== 3}
            inert={chapter !== 3}
          >
            <div className="eyebrow light">04 / EXTERIOR CARE</div>
            <h2>
              Care for
              <br />
              every curve.
            </h2>
            <p className="hero-support">
              A considered approach to every surface.
            </p>
            <a href="#services" className="text-link light-link">
              Explore our care approach <ArrowUpRight size={18} />
            </a>
            <p className="visual-note">Illustrative exterior care concept</p>
          </div>
          <div
            className="story-copy final-story"
            aria-hidden={chapter !== 4}
            inert={chapter !== 4}
          >
            <div className="eyebrow">05 / COMPLETE AUTOMOTIVE CARE</div>
            <h2>
              One destination.
              <br />
              Complete
              <br />
              automotive care.
            </h2>
            <p>From the way it drives to the way it feels.</p>
            <a href="#services" className="button button-primary">
              Discover the care <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <div className={`story-bottom wrap ${chapter === 4 ? "on-pearl" : ""}`}>
          <a href="#services" className="scroll-cue">
            <span className="scroll-line" /> SCROLL TO DISCOVER{" "}
            <ArrowDown size={13} />
          </a>
          <span className="chapter-display">
            <span className="chapter-number">0{chapter + 1}</span>
            <span className="chapter-rule" />
            {chapters[chapter]}
            <span className="chapter-total"> / 05</span>
          </span>
          <span className="image-disclosure">Illustrative studio visual</span>
        </div>
        <div className="story-progress">
          <div className="story-progress-fill" />
        </div>
      </div>
    </section>
  );
}
