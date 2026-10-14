import { useState } from "react";

/**
 * Image wrapper with graceful fallback support
 */
export default function SafeImage({ src, alt, className = "", ...props }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`image-fallback ${className}`}>
        <span>{alt || "SKY DEMAC"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
