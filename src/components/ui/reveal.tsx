"use client";

import { useEffect, useRef, useState } from "react";

type RevealVariant = "up" | "fade" | "left" | "right" | "scale";

// Generic scroll/mount reveal wrapper — mirrors the prototype's
// [data-reveal]/.is-in system exactly (see globals.css for the shared
// keyframes/timing). Elements below the fold reveal via
// IntersectionObserver the first time they scroll into view; pass
// `immediate` for above-the-fold content that should reveal on mount
// instead (matching the prototype's hero elements, which start `is-in`).
export function Reveal({
  children,
  variant = "up",
  delayMs = 0,
  immediate = false,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  immediate?: boolean;
  as?: "div" | "span" | "li";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIn, setIsIn] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      className={`${isIn ? "is-in" : ""} ${className}`}
      style={{ "--d": `${delayMs}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
