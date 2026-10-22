import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { business } from "../../config";
import Wordmark from "../common/Wordmark";

/**
 * Global Site Footer
 */
export default function Footer() {
  const [year] = useState(() => new Date().getFullYear());

  const scrollToTop = (e) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <Link to="/" className="brand" aria-label="SKY DEMAC home">
            <Wordmark />
          </Link>
          <p>
            Complete Automotive Care. Premium Detailing.
            <br />
            Professional Maintenance.
          </p>
          <a className="back-top" href="#top" onClick={scrollToTop}>
            Back to top <ArrowUpRight size={17} />
          </a>
        </div>

        {/* Suggested Directory Links */}
        <nav className="footer-menu" aria-label="Suggested website directory">
          {business.serviceMenu.map((item) => (
            <Link key={item.label} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer Meta & Socials */}
        <div className="footer-bottom">
          <span>© {year} SKY DEMAC AUTOMOTIVE</span>
          <span>Considered care. Every kilometre.</span>
          <div>
            {business.socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
