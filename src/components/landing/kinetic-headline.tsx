"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AccentUnderline } from "@/components/ui/accent-underline";

// Custom smooth ease — not linear, not bouncy.
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

// The hero's visual anchor: words fade up into focus on load, then a
// large, fully-feathered glow eases toward the cursor on hover. No
// gradient text-fill, no hard-edged mask — just soft light on dark navy.
export function KineticHeadline({
  text,
  accentText,
}: {
  text: string;
  /** Trailing phrase (must match the end of `text`) rendered in voyage-blue with a hand-drawn underline, matching the prototype's headline accent. */
  accentText?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 50, y: 50 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");
  const accentWordCount = accentText && text.endsWith(accentText) ? accentText.split(" ").length : 0;
  const accentStartIndex = words.length - accentWordCount;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const loop = () => {
      setGlow((prev) => ({
        x: prev.x + (target.current.x - prev.x) * 0.12,
        y: prev.y + (target.current.y - prev.y) * 0.12,
        opacity: prev.opacity,
      }));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    target.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }

  function renderWord(word: string, i: number, accent: boolean) {
    return (
      <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
        <motion.span
          className="inline-block will-change-transform"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: i * 0.07, ease: REVEAL_EASE }}
        >
          {accent ? <span className="text-voyage-blue">{word}</span> : word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      </span>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseEnter={() => setGlow((g) => ({ ...g, opacity: 1 }))}
      onMouseLeave={() => setGlow((g) => ({ ...g, opacity: 0 }))}
      className="relative"
    >
      <h1 className="text-balance font-display text-display leading-[1.02] font-extrabold tracking-[-0.03em] text-ink-navy">
        {words.slice(0, accentStartIndex).map((word, i) => renderWord(word, i, false))}
        {accentWordCount > 0 && (
          <span className="relative inline-block">
            {words.slice(accentStartIndex).map((word, j) => renderWord(word, accentStartIndex + j, true))}
            <AccentUnderline delayMs={300} />
          </span>
        )}
      </h1>

      {/* Soft, fully-feathered hover glow — oversized and heavily blurred
          so there is never a visible edge, no matter the cursor position. */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-[70%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-passport-sky/40 blur-[80px] transition-opacity duration-500 mix-blend-multiply"
          style={{
            left: `${glow.x}%`,
            top: `${glow.y}%`,
            opacity: glow.opacity * 0.8,
          }}
        />
      )}
    </div>
  );
}
