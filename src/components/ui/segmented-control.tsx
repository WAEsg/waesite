"use client";

import { useEffect, useRef } from "react";

// The prototype's `.seg`/`.seg__thumb` — a two-(or more)-option pill
// picker with a sliding white "thumb" behind whichever option is active,
// measured and positioned imperatively (translateX + width), same
// mechanic as the nav's hover pill.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: {
  options: { value: T; label: string }[];
  /** null renders with no option selected (no thumb) — e.g. an unset role preference. */
  value: T | null;
  onChange: (value: T) => void;
  className?: string;
}) {
  const segRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const thumb = thumbRef.current;
    const active = value ? optionRefs.current[value] : null;
    if (!thumb || !active) {
      if (thumb) thumb.style.opacity = "0";
      return;
    }
    thumb.style.opacity = "1";
    thumb.style.width = `${active.offsetWidth}px`;
    thumb.style.transform = `translateX(${active.offsetLeft}px)`;
  }, [value]);

  return (
    <div
      ref={segRef}
      className={`relative inline-grid max-w-full grid-flow-col auto-cols-fr rounded-full bg-cloud-blue p-[5px] ${className}`}
    >
      <span
        ref={thumbRef}
        aria-hidden
        className="absolute top-[5px] bottom-[5px] left-0 w-0 rounded-full bg-white opacity-0 shadow-1 transition-[transform,width,opacity] duration-500 ease-out"
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          ref={(el) => {
            optionRefs.current[opt.value] = el;
          }}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative z-[1] min-h-11 rounded-full px-[18px] py-3 text-[0.9375rem] font-extrabold transition-colors duration-200 ${
            value === opt.value ? "text-voyage-blue" : "text-slate"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
