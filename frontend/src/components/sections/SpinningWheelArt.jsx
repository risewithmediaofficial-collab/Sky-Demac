import { memo } from "react";

/**
 * SpinningWheelArt
 * Renders the high-performance SVG composite of the Porsche hero background
 * and the continuously spinning wheel animation frame overlay.
 *
 * Using an SVG viewBox (1376 x 768) with `preserveAspectRatio="xMidYMid slice"`
 * guarantees 100% lockstep alignment between the car body and the wheel rim across
 * desktop, tablet, and mobile screens without subpixel drift or aspect-ratio distortion.
 */
function SpinningWheelArt({ side, wheelRef }) {
  const clipId = `wheel-clip-mask-${side}`;

  return (
    <svg
      viewBox="0 0 1376 768"
      preserveAspectRatio="xMidYMid slice"
      className={`fold-phone-image fold-phone-image-${side} fold-phone-wheel-svg`}
      aria-hidden="true"
      role="presentation"
      focusable="false"
      style={{
        display: "block",
        userSelect: "none",
        WebkitUserSelect: "none",
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* Precise circular boundary matching the tire & rim perimeter (center: 693, 378, radius: 270) */}
        <clipPath id={clipId}>
          <circle cx="693" cy="378" r="270" />
        </clipPath>
      </defs>

      {/* Static Porsche car and workshop background (1376 x 768) */}
      <image
        href="/wheel-hero/hero-background.webp"
        x="0"
        y="0"
        width="1376"
        height="768"
        preserveAspectRatio="none"
      />

      {/* Dynamic spinning rim and spokes frame overlay (546 x 546 at x=420, y=105) */}
      <image
        ref={wheelRef}
        href="/wheel-hero/frames/wheel-00.webp"
        x="420"
        y="105"
        width="546"
        height="546"
        preserveAspectRatio="none"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

export default memo(SpinningWheelArt);
