import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ScrollTrigger positional reveals for editorial sections
 * Degrades gracefully on low-memory devices or reduced-motion preference
 */
export function useSectionReveals() {
  useEffect(() => {
    const device = navigator;

    if (
      device.connection?.saveData ||
      (device.deviceMemory && device.deviceMemory < 4)
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
      () => {
        document
          .querySelectorAll(".section-heading,.work-copy,.about-copy")
          .forEach((element) => {
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
      }
    );

    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      media.revert();
    };
  }, []);
}

export default useSectionReveals;
