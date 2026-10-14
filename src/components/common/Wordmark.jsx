import { business } from "../../config";

/**
 * Brand wordmark / logo component
 */
export default function Wordmark() {
  if (business.logo) {
    return (
      <img
        className="brand-logo"
        src={business.logo}
        alt={business.name}
      />
    );
  }

  return (
    <span className="wordmark">
      SKY DEMAC<span>AUTOMOTIVE</span>
    </span>
  );
}
