"use client";

import { useEffect, useRef, useState } from "react";

export type ReleaseStage = {
  // A pre-rendered icon element (e.g. <Lock className="h-4 w-4" />), not
  // a component reference — this crosses a server/client boundary, and
  // function/component references can't be passed as props across it.
  icon: React.ReactNode;
  day: string;
  what: string;
  note?: string;
};

// Exact port of the prototype's ".release" component: a track bar that
// fills left-to-right (scaleX 0 -> 1) and dots that flip from
// line-bordered/white to voyage-blue-filled + scaled up, all triggered
// together the first time the timeline scrolls into view.
export function ReleaseTimeline({ stages }: { stages: ReleaseStage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative pt-1.5">
      <div className="absolute top-[28px] right-[8%] left-[8%] h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
        <div
          className={`h-full w-full origin-left rounded-full bg-gradient-to-r from-passport-sky to-voyage-blue transition-transform duration-700 ease-out ${
            isIn ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>
      <div className="relative grid gap-3" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}>
        {stages.map((stage) => (
          <div key={stage.day} className="flex flex-col items-center gap-1.5 text-center">
              <span
                className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] transition-all duration-300 ${
                  isIn ? "scale-[1.08] border-voyage-blue bg-voyage-blue text-white" : "border-line bg-white text-transparent"
                }`}
              >
                {stage.icon}
              </span>
              <span className="mt-1.5 font-mono text-xs font-bold tracking-[0.12em] text-voyage-blue uppercase">{stage.day}</span>
              <span className="font-extrabold text-ink-navy">{stage.what}</span>
              {stage.note && <p className="max-w-[24ch] text-sm text-slate">{stage.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
