import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FRAME_COUNT = 36;
const FRAME_RATE = 28; // Smooth clockwise rotation
const FRAME_INTERVAL = 1000 / FRAME_RATE;
const TOTAL_LOADER_TIME = 2000; // Exactly 2 seconds
const DOCK_START_TIME = 1100; // Start morph/dock into the car wheel at 1.1s

const wheelFrames = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/wheel-hero/frames/wheel-${String(i).padStart(2, "0")}.webp`
);

/**
 * WheelLoader
 * Full-screen 2-Second Website Loader that seamlessly flies and docks into
 * the hero Porsche car wheel.
 *
 * 0.0s - 1.1s: Center spinning Porsche wheel on solid #090909 background with branding.
 * 1.1s - 2.0s: The dark background dissolves while the wheel scales and translates
 *              smoothly in 3D directly onto the front wheel of the Porsche car in the hero section.
 * 2.0s: The wheel is perfectly fixed into the car image; the hero section takes over.
 */
export default function WheelLoader({ onFinish }) {
  const [isDocking, setIsDocking] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [targetStyle, setTargetStyle] = useState(null);

  const wheelImgRef = useRef(null);
  const progressLineRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Preload background image and all 36 frames immediately
    const bg = new Image();
    bg.src = "/wheel-hero/hero-background.webp";

    wheelFrames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let rafId = null;
    const startTime = performance.now();
    let lastFrameTime = startTime;
    let currentFrame = 0;

    const animateWheel = (now) => {
      const delta = now - lastFrameTime;
      if (delta >= FRAME_INTERVAL) {
        const steps = Math.floor(delta / FRAME_INTERVAL);
        currentFrame = (currentFrame + steps) % FRAME_COUNT;
        lastFrameTime = now - (delta % FRAME_INTERVAL);
        if (wheelImgRef.current) {
          wheelImgRef.current.src = wheelFrames[currentFrame];
        }
      }

      // Progress bar fill over 2000ms
      const elapsed = Math.min(TOTAL_LOADER_TIME, now - startTime);
      if (progressLineRef.current) {
        const pct = (elapsed / TOTAL_LOADER_TIME) * 100;
        progressLineRef.current.style.width = `${pct}%`;
      }

      rafId = requestAnimationFrame(animateWheel);
    };

    rafId = requestAnimationFrame(animateWheel);

    // At 1.1s: calculate exact coordinates of the hero car wheel and begin morph/dock
    const dockTimer = setTimeout(() => {
      const phone = document.querySelector(".fold-phone");
      if (phone) {
        const rect = phone.getBoundingClientRect();
        // In the 1376x768 hero image coordinate system:
        // Wheel center is at X=693 (50.36%), Y=378 (49.22%)
        // Wheel diameter is 546 (39.68% of 1376)
        const targetCenterX = rect.left + rect.width * (693 / 1376);
        const targetCenterY = rect.top + rect.height * (378 / 768);
        const targetDiameter = rect.width * (546 / 1376);

        setTargetStyle({
          left: `${targetCenterX}px`,
          top: `${targetCenterY}px`,
          width: `${targetDiameter}px`,
          height: `${targetDiameter}px`,
          transform: "translate(-50%, -50%)",
        });
      }
      setIsDocking(true);
    }, DOCK_START_TIME);

    // At 2.0s: finish loading, hero section takes over seamlessly
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, TOTAL_LOADER_TIME);

    // At 2.15s: remove loader overlay completely from DOM
    const removeTimer = setTimeout(() => {
      setIsRemoved(true);
      if (rafId) cancelAnimationFrame(rafId);
    }, TOTAL_LOADER_TIME + 150);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(dockTimer);
      clearTimeout(finishTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  if (isRemoved || typeof document === "undefined") return null;

  const content = (
    <>
      {/* Full-screen Dark Overlay that dissolves smoothly over the hero section */}
      <div
        className={`fixed inset-0 z-[999998] pointer-events-none select-none transition-opacity duration-700 ease-out ${
          isDocking ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundColor: "#090909",
        }}
        aria-hidden="true"
      />

      {/* Moving & Scaling Wheel that flies from center directly into the Porsche car */}
      <div
        className="fixed z-[999999] pointer-events-none select-none flex items-center justify-center"
        style={
          isDocking && targetStyle
            ? {
                ...targetStyle,
                transition: "all 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
              }
            : {
                left: "50%",
                top: "48%",
                width: "clamp(190px, 24vw, 260px)",
                height: "clamp(190px, 24vw, 260px)",
                transform: "translate(-50%, -50%)",
                transition: "all 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
              }
        }
      >
        {/* Ambient radial red glow (fades out as it approaches car) */}
        <div
          className={`absolute inset-[-20%] rounded-full transition-opacity duration-500 pointer-events-none ${
            isDocking ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(227, 30, 36, 0.3) 0%, rgba(227, 30, 36, 0.06) 50%, transparent 70%)",
            filter: "blur(32px)",
          }}
          aria-hidden="true"
        />

        {/* Circular Wheel Frame */}
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          <img
            ref={wheelImgRef}
            src="/wheel-hero/frames/wheel-00.webp"
            alt="Porsche Wheel"
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{
              clipPath: "circle(49.4% at 50% 50%)",
            }}
          />
        </div>
      </div>

      {/* Loader Branding and Progress Indicator (Fades out when docking begins) */}
      <div
        className={`fixed left-1/2 bottom-[14%] -translate-x-1/2 z-[999999] pointer-events-none select-none flex flex-col items-center gap-2 transition-all duration-300 ${
          isDocking ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#e31e24" }}
            aria-hidden="true"
          />
          <span
            className="font-bold tracking-[0.28em] text-[11px] sm:text-xs text-white/90 uppercase"
            style={{
              fontFamily: "var(--font-heading, sans-serif)",
              letterSpacing: "0.26em",
            }}
          >
            SKY DEMAC AUTOMOTIVE
          </span>
        </div>

        <span className="text-[10px] tracking-[0.18em] text-neutral-400 uppercase">
          Built for the Pressure
        </span>

        {/* Minimalist 2-second animated progress line */}
        <div
          className="w-36 sm:w-44 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2 relative"
          aria-hidden="true"
        >
          <div
            ref={progressLineRef}
            className="h-full rounded-full"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, #e31e24 0%, #ff4d52 100%)",
              boxShadow: "0 0 8px rgba(227, 30, 36, 0.8)",
            }}
          />
        </div>
      </div>
    </>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : null;
}
