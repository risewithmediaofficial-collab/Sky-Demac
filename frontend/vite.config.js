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
});
