import { useEffect } from "react";

export function useSectionReveals() {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
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
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add(
          "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
          () => {
            document
              .querySelectorAll(".section-heading,.work-copy,.about-copy")
              .forEach((element) => {
                // A small positional reveal keeps all text readable even before the trigger.
                gsap.from(element, {
                  y: 16,
                  duration: 0.65,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: element,
                    start: "top 92%",
                    once: true,
                  },
                });
              });
          },
        );
        cleanup = () => media.revert();
        document.fonts.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
      })
      .catch(() => {
        /* Sections are fully visible if animation loading fails. */
      });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);
}
