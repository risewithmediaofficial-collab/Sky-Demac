import { business } from "../../config";

/**
 * Brand wordmark / logo component
 */
export default function Wordmark({ variant = "header", className = "" }) {
  const logoSrc = business.logo || "/images/skey demac logo.png";

  return (
    <div className={`brand-logo-frame brand-logo-${variant}-frame ${className}`.trim()}>
      <img
        className={`brand-logo brand-logo-${variant}`}
        src={logoSrc}
        alt={business.name || "SKY DEMAC AUTOMOTIVE"}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
