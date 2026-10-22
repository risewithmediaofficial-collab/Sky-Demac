import { BrowserRouter, Routes, Route } from "react-router-dom";
import { business } from "./config";
import Layout from "./components/layout/Layout";
import SmoothScroll from "./components/common/SmoothScroll";
import HomePage from "./pages/HomePage";
import ServicesOverviewPage from "./pages/ServicesOverviewPage";
import ServicePage from "./pages/ServicePage";
import GalleryPage from "./pages/GalleryPage";
import BookServicePage from "./pages/BookServicePage";
import AboutPage from "./pages/AboutPage";

/**
 * Root Application Component
 * Manages client-side routing within the global site Layout
 */
export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Layout>
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
        </Layout>
      </SmoothScroll>
    </BrowserRouter>
  );
}
