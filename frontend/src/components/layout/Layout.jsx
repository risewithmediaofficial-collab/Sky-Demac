import Header from "./Header";
import Footer from "./Footer";
import QuickAccessDock from "./QuickAccessDock";
import { business } from "../../config";

/**
 * Root Layout wrapper for the entire application
 */
export default function Layout({ children }) {
  return (
    <div
      className="app"
      style={{
        "--accent": business.accent,
        "--accent-hover": business.accentHover,
      }}
    >
      <a className="skip-link" href="#services">
        Skip to services
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <QuickAccessDock />
      <Footer />
    </div>
  );
}
