import { useState, type ImgHTMLAttributes } from "react";

export default function SafeImage({
  className = "",
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span
        className={`image-fallback ${className}`}
        role="img"
        aria-label={`${alt}. Image unavailable.`}
      >
        <span>
          SKY DEMAC<span>AUTOMOTIVE</span>
        </span>
      </span>
    );
  return (
    <img
      {...props}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
