import { useState } from "react";

/**
 * Image wrapper with graceful fallback support
 */
export default function SafeImage({
  src,
  alt,
  className = "",
  loading,
  decoding,
  fetchPriority,
  priority,
  ...props
}) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`image-fallback ${className}`}>
        <span>{alt || "SKY DEMAC"}</span>
      </div>
    );
  }

  const isHighPriority = fetchPriority === "high" || priority === true || loading === "eager";
  const resolvedLoading = isHighPriority ? "eager" : (loading || "lazy");
  const resolvedDecoding = decoding || "async";

  return (
    <img
      src={src}
      alt={alt}
      loading={resolvedLoading}
      decoding={resolvedDecoding}
      fetchPriority={fetchPriority}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
