import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { business } from "./src/config.js";

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: "business-metadata",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          return html
            .replaceAll("%BUSINESS_TITLE%", escapeHtml(business.seo.title))
            .replaceAll(
              "%BUSINESS_DESCRIPTION%",
              escapeHtml(business.seo.description),
            )
            .replaceAll(
              "%BUSINESS_KEYWORDS%",
              escapeHtml(
                business.seo.keywords ? business.seo.keywords.join(", ") : "",
              ),
            )
            .replaceAll(
              "%BUSINESS_SUPPORT%",
              escapeHtml(business.supportingLine),
            )
            .replaceAll("%BUSINESS_URL%", escapeHtml(business.seo.url))
            .replaceAll(
              "%ROBOTS%",
              business.launchReady ? "index, follow" : "noindex, nofollow",
            );
        },
      },
    },
  ],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/")
          ) {
            return "react-core";
          }
          if (id.includes("node_modules/gsap/")) {
            return "gsap-animation";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "lucide-icons";
          }
          if (id.includes("node_modules/lenis/")) {
            return "lenis-scroll";
          }
        },
      },
    },
  },
});
