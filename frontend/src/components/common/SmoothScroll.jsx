import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SmoothScroll Provider
 * Integrates Lenis 60fps/120fps momentum scrolling in lockstep with GSAP ScrollTrigger.
 * Eliminates scroll stutter and latency while guaranteeing synchronous pinning accuracy.
 */
export default function SmoothScroll({ children }) {
  const location = useLocation();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Detect touch / coarse-pointer mobile devices
    const isTouchDevice =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    let lenis = null;
    let onTick = null;

    if (!isTouchDevice) {
      // On desktop: use smooth momentum wheel scrolling
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        syncTouch: false,
        infinite: false,
      });

      window.__lenis = lenis;

      // Connect Lenis to ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Drive Lenis RAF loop strictly through GSAP's ticker
      onTick = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(onTick);
      // Use resilient lag smoothing rather than 0 so minor hiccups do not cause frame skips
      gsap.ticker.lagSmoothing(500, 33);
    }

    // Smoothly handle in-page hash links (e.g. #services, #contact, #home)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest("a[href*='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(target, { offset: -30, duration: 1.1 });
          } else {
            const top = target.getBoundingClientRect().top + window.scrollY - 30;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Refresh triggers once fonts and initial layout load
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (onTick) {
        gsap.ticker.remove(onTick);
      }
      if (lenis) {
        lenis.destroy();
        window.__lenis = null;
      }
    };
  }, []);

  // When route changes, immediately reset scroll to top and refresh ScrollTrigger
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    // Allow React tree to settle before recalculating trigger offsets
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 80);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return children;
}
