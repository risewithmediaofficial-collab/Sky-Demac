import { useEffect, useState } from "react";

const FRAME_COUNT = 36;
const FRAME_RATE = 24;
const frames = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/wheel-hero/frames/wheel-${String(i).padStart(2, "0")}.webp`
);

export default function SpinningWheelHero() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Preload frame assets before animation.
    frames.forEach((src) => { const img = new Image(); img.src = src; });
    let raf, last = 0, count = 0;
    const animate = (time) => {
      if (time - last >= 1000 / FRAME_RATE) {
        count = (count + 1) % FRAME_COUNT;
        setFrame(count);
        last = time;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#090b0d]" aria-label="Automotive hero">
      <img src="/wheel-hero/hero-background.webp" alt="Red sports car in a workshop" className="block w-full h-auto" />
      {/* Exact placement relative to original 1376x768 image. */}
      <img src={frames[frame]} alt="" aria-hidden="true" draggable="false"
        className="pointer-events-none absolute select-none"
        style={{ left: `${420 / 1376 * 100}%`, top: `${105 / 768 * 100}%`,
          width: `${546 / 1376 * 100}%`, height: `${546 / 768 * 100}%` }} />
      {/* Place your existing hero headings/buttons here, absolute over the image. */}
    </section>
  );
}
