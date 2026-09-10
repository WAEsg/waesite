"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { howItWorksSteps } from "@/lib/landing-data";
import { glassCard, glowShadow } from "@/components/ui/glass";

// One gentle arc from the globe (posted request) up and over to a pin
// (matched talent). This exact "d" is reused for both the visible dotted
// line and the plane's path.
const PATH_D = "M 40 170 C 260 20, 640 20, 860 170";
// Extra horizontal margin on each side so the "Your request" / "Matched
// talent" labels never clip against the SVG's default overflow:hidden —
// their text extends past the path's own endpoints since it's centered.
const VIEW_X = -20;
const VIEW_W = 940;
const VIEW_H = 200;

function samplePath(path: SVGPathElement | null, progress: number) {
  if (!path) return { x: 40, y: 170, angle: 0 };
  const total = path.getTotalLength();
  const length = Math.min(Math.max(progress, 0), 1) * total;
  const point = path.getPointAtLength(length);
  const ahead = path.getPointAtLength(Math.min(length + 1, total));
  const angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;
  return { x: point.x, y: point.y, angle };
}

function PlaneShape() {
  return <path d="M11 0 L-8 6 L-2 0 L-8 -6 Z" fill="var(--color-passport-sky)" />;
}

export function FlightPathSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const planeX = useTransform(scrollYProgress, (t) => samplePath(pathRef.current, t).x);
  const planeY = useTransform(scrollYProgress, (t) => samplePath(pathRef.current, t).y);
  const planeRotate = useTransform(
    scrollYProgress,
    (t) => samplePath(pathRef.current, t).angle
  );

  const highlights = [
    useTransform(scrollYProgress, [0, 0.3, 0.45], [1, 1, 0.35]),
    useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.35, 1, 0.35]),
    useTransform(scrollYProgress, [0.55, 0.7, 1], [0.35, 1, 1]),
  ];

  return (
    <div ref={sectionRef} className="mx-auto max-w-5xl px-4 py-16">
      <div className="relative mx-auto w-full max-w-3xl">
        <svg viewBox={`${VIEW_X} 0 ${VIEW_W} ${VIEW_H}`} className="w-full" aria-hidden="true">
          <path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke="var(--color-passport-sky)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="1 14"
            strokeOpacity={0.6}
          />
          {/* Start: mini globe, echoing the hero's globe */}
          <g transform="translate(40 170)">
            <circle r={9} fill="none" stroke="var(--color-passport-sky)" strokeWidth={1.6} />
            <ellipse rx={4} ry={9} fill="none" stroke="var(--color-passport-sky)" strokeWidth={1.2} />
            <line x1={-9} y1={0} x2={9} y2={0} stroke="var(--color-passport-sky)" strokeWidth={1.2} />
          </g>
          {/* End: pin marking the matched talent */}
          <path
            d="M860 161 c6 0 10 4 10 9 0 6.5-10 15-10 15s-10-8.5-10-15c0-5 4-9 10-9z"
            fill="var(--color-passport-sky)"
          />
          <text
            x={40}
            y={196}
            textAnchor="middle"
            fill="var(--color-mist)"
            style={{ font: "600 13px var(--font-sans), sans-serif" }}
          >
            Your request
          </text>
          <text
            x={860}
            y={196}
            textAnchor="middle"
            fill="var(--color-mist)"
            style={{ font: "600 13px var(--font-sans), sans-serif" }}
          >
            Matched talent
          </text>

          {prefersReducedMotion ? (
            <g transform="translate(450 95)">
              <PlaneShape />
            </g>
          ) : (
            <motion.g style={{ x: planeX, y: planeY, rotate: planeRotate }}>
              <PlaneShape />
            </motion.g>
          )}
        </svg>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {howItWorksSteps.map((step, index) => (
          <div key={step.number} className={`relative overflow-hidden p-5 ${glassCard}`}>
            {prefersReducedMotion ? (
              <div className="absolute inset-0 bg-gradient-to-br from-passport-sky/20 to-transparent" />
            ) : (
              <motion.div
                style={{ opacity: highlights[index] }}
                className="absolute inset-0 bg-gradient-to-br from-passport-sky/20 to-transparent"
              />
            )}
            <div className="relative">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-voyage-blue to-passport-sky font-display text-sm font-bold text-frost ${glowShadow}`}>
                {step.number}
              </span>
              <h3 className="mt-3 font-display font-semibold text-frost">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-mist">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
