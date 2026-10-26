import { useEffect, useRef, memo } from "react";

const FRAME_COUNT = 36;
const FRAME_RATE = 24; // Smooth realistic rotation speed
const FRAME_INTERVAL = 1000 / FRAME_RATE;
const ANIMATION_DURATION = 10000; // Exactly 10 seconds

const wheelFrames = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/wheel-hero/frames/wheel-${String(i).padStart(2, "0")}.webp`
);

/**
 * AnimatedHeroWheel
 * Renders the normal rectangular Porsche hero image and executes a continuous,
 * realistic 10-second wheel spin immediately following the initial loader.
 *
 * Uses SVG viewBox coordinate scaling (1376 x 768) and a circular clipPath (cx=693, cy=378, r=270)
 * to ensure that:
 * 1. The wheel is positioned with mathematical perfection over the front tire.
 * 2. The car body, background, Brembo brake caliper, and Porsche crest badge remain completely stationary.
 * 3. The wheel overlay scales in lockstep with the car across desktop, tablet, and mobile.
 * 4. After 10 seconds, the rotation halts cleanly, preserving the final frame indefinitely without re-renders.
 */
function AnimatedHeroWheel({ isActive = false, className = "" }) {
  const wheelImgRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Only start once activated by the loader completion
    if (!isActive || hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (typeof window === "undefined") return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    let rafId = null;
    let startTime = null;
    let lastFrameTime = 0;
    let currentFrame = 0;

    const animate = (now) => {
      if (startTime === null) {
        startTime = now;
        lastFrameTime = now;
      }

      const totalElapsed = now - startTime;

      // Exactly 10-second duration check
      if (totalElapsed >= ANIMATION_DURATION) {
        // Freeze smoothly on current final frame; halt RAF loop completely
        if (wheelImgRef.current) {
          const finalSrc = wheelFrames[currentFrame];
          wheelImgRef.current.setAttribute("href", finalSrc);
          wheelImgRef.current.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", finalSrc);
        }
        return;
      }

      const delta = now - lastFrameTime;
      if (delta >= FRAME_INTERVAL) {
        const steps = Math.floor(delta / FRAME_INTERVAL);
        currentFrame = (currentFrame + steps) % FRAME_COUNT;
        lastFrameTime = now - (delta % FRAME_INTERVAL);

        if (wheelImgRef.current) {
          const frameSrc = wheelFrames[currentFrame];
          wheelImgRef.current.setAttribute("href", frameSrc);
          wheelImgRef.current.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", frameSrc);
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isActive]);

  return (
    <svg
      viewBox="0 0 1376 768"
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full block pointer-events-none select-none ${className}`}
      aria-hidden="true"
      role="presentation"
      focusable="false"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    >
      <defs>
        {/* Exact circular mask matching the tire & rim perimeter */}
        <clipPath id="hero-wheel-clip">
          <circle cx="693" cy="378" r="270" />
        </clipPath>
      </defs>

      {/* Static Background: Red Porsche car in the workshop (1376 x 768) */}
      <image
        href="/wheel-hero/hero-background.webp"
        x="0"
        y="0"
        width="1376"
        height="768"
        preserveAspectRatio="none"
      />

      {/* Synchronized rotating wheel overlay (546 x 546 at x=420, y=105) */}
      <image
        ref={wheelImgRef}
        href="/wheel-hero/frames/wheel-00.webp"
        x="420"
        y="105"
        width="546"
        height="546"
        preserveAspectRatio="none"
        clipPath="url(#hero-wheel-clip)"
      />
    </svg>
  );
}

export default memo(AnimatedHeroWheel);
