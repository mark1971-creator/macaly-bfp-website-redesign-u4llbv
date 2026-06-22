import type { ImgHTMLAttributes } from "react";

const FALLBACK = "/images/article-fallback.jpg";

export function SafeImg({ src, onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      src={src}
      onError={(e) => {
        const el = e.currentTarget;
        if (el.dataset.fallbackApplied !== "1" && el.src !== FALLBACK) {
          el.dataset.fallbackApplied = "1";
          el.src = FALLBACK;
        }
        onError?.(e);
      }}
    />
  );
}
