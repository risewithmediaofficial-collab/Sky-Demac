import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { business } from "./config";
import { Layout } from "./components/layout";
import { SmoothScroll } from "./components/common";

import HomePage from "./pages/HomePage";
const ServicesOverviewPage = lazy(() => import("./pages/ServicesOverviewPage"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const BookServicePage = lazy(() => import("./pages/BookServicePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-busy="true"
      aria-label="Loading page..."
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          border: "2px solid rgba(227, 30, 36, 0.15)",
          borderTopColor: "var(--accent, #e31e24)",
          borderRadius: "50%",
          animation: "spin 0.6s linear infinite",
        }}
      />
    </div>
  );
}

/**
 * Root Application Component
 * Manages client-side routing within the global site Layout
 */
export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Layout>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesOverviewPage />} />
              <Route
                path="/mechanical-services"
                element={<ServicePage forcedCategory={business.categories[0]} />}
              />
              <Route
                path="/detailing-ceramic-studio"
                element={<ServicePage forcedCategory={business.categories[1]} />}
              />
              <Route
                path="/car-wash"
                element={<ServicePage forcedCategory={business.categories[2]} />}
              />
              <Route
                path="/denting-painting"
                element={<ServicePage forcedCategory={business.categories[3]} />}
              />
              <Route
                path="/ppf-paint-protection"
                element={<ServicePage forcedCategory={business.categories[1]} />}
              />
              <Route
                path="/accessories-upgrades"
                element={<ServicePage forcedCategory={business.categories[4]} />}
              />
              <Route
                path="/tyres-wheels"
                element={<ServicePage forcedCategory={business.categories[5]} />}
              />
              <Route
                path="/electrical-ac"
                element={<ServicePage forcedCategory={business.categories[6]} />}
              />
              <Route
                path="/special-care"
                element={<ServicePage forcedCategory={business.categories[7]} />}
              />
              <Route
                path="/additional-services"
                element={<ServicePage forcedCategory={business.categories[8]} />}
              />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/our-work" element={<GalleryPage />} />
              <Route path="/work" element={<GalleryPage />} />
              <Route path="/book-service" element={<BookServicePage />} />
              <Route path="/contact" element={<BookServicePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </Layout>
      </SmoothScroll>
    </BrowserRouter>
  );
}
