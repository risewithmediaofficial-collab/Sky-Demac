import { business } from "../../config";

/**
 * Brand wordmark / logo component
 */
export default function Wordmark({ variant = "header", className = "" }) {
  const logoPng = business.logo || "/images/skey demac logo.png";
  const logoWebp = "/images/sky-demac-logo.webp";

  return (
    <div className={`brand-logo-frame brand-logo-${variant}-frame ${className}`.trim()}>
      <picture>
        <source srcSet={logoWebp} type="image/webp" />
        <img
          className={`brand-logo brand-logo-${variant}`}
          src={logoPng}
          alt={business.name || "SKY DEMAC AUTOMOTIVE"}
          width="260"
          height="195"
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  );
}
