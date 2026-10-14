import { ArrowDown } from "lucide-react";

/**
 * Editorial Brand Strip
 */
export default function BrandStrip() {
  return (
    <div className="brand-strip">
      <div className="wrap">
        <span>COMPLETE AUTOMOTIVE CARE</span>
        <span className="strip-dot" />
        <span>PREMIUM DETAILING</span>
        <span className="strip-dot" />
        <span>PROFESSIONAL MAINTENANCE</span>
        <a href="#services" aria-label="Discover automotive care">
          <ArrowDown size={18} />
        </a>
      </div>
    </div>
  );
}
