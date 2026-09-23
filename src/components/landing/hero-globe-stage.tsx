"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Lock, IdCard } from "lucide-react";
import { MockupCard } from "@/components/ui/mockup-card";
import { Reveal } from "@/components/ui/reveal";
import { PrototypeGlobe } from "./prototype-globe";

// Ported near-verbatim from the prototype's home-page script: the
// "Example match" chip listens for the globe's `ww:arc` events (fired
// each time a new great-circle route spawns) and swaps its route/role
// text to follow along, throttled so a route stays readable for a bit.
const ROLES = [
  "Bookkeeper",
  "Video Editor",
  "Web Developer",
  "Virtual Assistant",
  "Graphic Designer",
  "Data Analyst",
  "QA Tester",
  "Accountant",
  "SEO Specialist",
  "Project Manager",
];
const MIN_GAP = 2600;
const SETTLE = 1300;

function isCode(v: string) {
  return /^[A-Z]{3}$/.test(v);
}

export function HeroGlobeStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef(0);
  const idxRef = useRef(0);
  const matchRef = useRef({ from: "SIN", to: "MNL" });
  const [match, setMatch] = useState({ from: "SIN", to: "MNL", role: "Bookkeeper" });
  const [swapPhase, setSwapPhase] = useState<"idle" | "out" | "pre">("idle");
  const [hit, setHit] = useState(false);

  useEffect(() => {
    lastRef.current = Date.now() - MIN_GAP + SETTLE;
    const el = wrapRef.current;
    if (!el) return;

    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // ignore
    }

    let t1 = 0;
    let t2 = 0;

    function onArc(e: Event) {
      const detail = (e as CustomEvent).detail as
        | { from?: { code?: string }; to?: { code?: string } }
        | undefined;
      if (!detail?.from?.code || !detail?.to?.code) return;
      const a = detail.from.code.toUpperCase();
      const b = detail.to.code.toUpperCase();
      if (!isCode(a) || !isCode(b) || a === b) return;
      if (matchRef.current.from === a && matchRef.current.to === b) return;
      const now = Date.now();
      if (now - lastRef.current < MIN_GAP) return;
      lastRef.current = now;
      idxRef.current = (idxRef.current + 1) % ROLES.length;
      const role = ROLES[idxRef.current];

      if (reduced) {
        matchRef.current = { from: a, to: b };
        setMatch({ from: a, to: b, role });
        return;
      }

      window.clearTimeout(t1);
      window.clearTimeout(t2);
      setSwapPhase("out");
      t1 = window.setTimeout(() => {
        matchRef.current = { from: a, to: b };
        setMatch({ from: a, to: b, role });
        setSwapPhase("pre");
        requestAnimationFrame(() => setSwapPhase("idle"));
        setHit(true);
        t2 = window.setTimeout(() => setHit(false), 380);
      }, 210);
    }

    el.addEventListener("ww:arc", onArc, true);
    return () => {
      el.removeEventListener("ww:arc", onArc, true);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  // Light pointer parallax on the floating chips (mouse only, matching the
  // prototype's `bindParallax`) — sets --px/--py on this wrapper, which
  // each MockupCard's `parallaxK` reads to drift by its own factor.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let fine = false;
    try {
      fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    } catch {
      // ignore
    }
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // ignore
    }
    if (!fine || reduced) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    function paint() {
      raf = 0;
      el!.style.setProperty("--px", px.toFixed(3));
      el!.style.setProperty("--py", py.toFixed(3));
    }
    function queue() {
      if (!raf) raf = window.requestAnimationFrame(paint);
    }
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = el!.getBoundingClientRect();
      if (!r.width || !r.height) return;
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      queue();
    }
    function onLeave() {
      px = 0;
      py = 0;
      queue();
    }
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative min-h-[420px]">
      <div className="relative isolate mx-auto aspect-square w-full max-w-[560px]">
        {/* Soft light-blue halo behind the sphere — exact match for the
            prototype's .globe::before radial gradient (inset -4%). */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 rounded-full"
          style={{
            inset: "-4%",
            background:
              "radial-gradient(closest-side, rgba(201,221,247,.55) 0%, rgba(228,238,253,.6) 60%, rgba(228,238,253,.32) 78%, rgba(228,238,253,0) 100%)",
          }}
        />
        <PrototypeGlobe className="rounded-full" />
      </div>
      <Reveal variant="scale" delayMs={200} immediate className="absolute -left-2 top-6 w-56 sm:-left-6">
        <MockupCard
          live
          from={match.from}
          to={match.to}
          meta={match.role}
          icon={CheckCircle2}
          floatDelay="0s"
          swapPhase={swapPhase}
          hit={hit}
          parallaxK={14}
        />
      </Reveal>
      <Reveal variant="scale" delayMs={250} immediate className="absolute bottom-20 right-0 w-56 sm:-right-4">
        <MockupCard from="DAY 0" to="DAY 30" meta="Held via Stripe Connect" icon={Lock} floatDelay="-2s" parallaxK={-9} />
      </Reveal>
      <Reveal variant="scale" delayMs={300} immediate className="absolute bottom-0 left-4 w-52">
        <MockupCard from="HIRER" to="TALENT" meta="Both sides ID-verified" icon={IdCard} floatDelay="-4s" parallaxK={7} />
      </Reveal>
      <p className="absolute -bottom-8 left-1/2 w-full -translate-x-1/2 text-center text-xs text-ink-navy/40">
        Illustrative routes. Hirers and Talent Partners can be anywhere.
      </p>
    </div>
  );
}
