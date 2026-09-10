"use client";

import createGlobe, { type Marker } from "cobe";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Singapore is the hub; the rest sketch a genuinely global talent pool
// spanning every populated continent, not just Southeast Asia.
const HUB: [number, number] = [1.3521, 103.8198];
const TALENT_HUBS: { location: [number, number]; size: number }[] = [
  { location: [14.5995, 120.9842], size: 0.05 }, // Manila
  { location: [-6.2088, 106.8456], size: 0.05 }, // Jakarta
  { location: [12.9716, 77.5946], size: 0.05 }, // Bangalore
  { location: [23.8103, 90.4125], size: 0.045 }, // Dhaka
  { location: [-1.2921, 36.8219], size: 0.05 }, // Nairobi
  { location: [6.5244, 3.3792], size: 0.045 }, // Lagos
  { location: [-23.5505, -46.6333], size: 0.05 }, // Sao Paulo
  { location: [19.4326, -99.1332], size: 0.045 }, // Mexico City
  { location: [52.2297, 21.0122], size: 0.045 }, // Warsaw
  { location: [51.5072, -0.1276], size: 0.05 }, // London
];

const hexToRgb01 = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const BASE_COLOR = hexToRgb01("#CFE3FA");
const MARKER_COLOR = hexToRgb01("#1E4FA3");
const GLOW_COLOR = hexToRgb01("#4A90E2");
const ARC_COLOR = hexToRgb01("#4A90E2");

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [dragging, setDragging] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    let width = wrapper.offsetWidth;
    let phi = 0;
    let frameId = 0;

    const markers: Marker[] = [{ location: HUB, size: 0.09 }, ...TALENT_HUBS];

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.28,
      dark: 0,
      diffuse: 1.2,
      scale: 1,
      mapSamples: 14000,
      mapBrightness: 4,
      baseColor: BASE_COLOR,
      markerColor: MARKER_COLOR,
      glowColor: GLOW_COLOR,
      arcColor: ARC_COLOR,
      arcWidth: 0.4,
      arcHeight: 0.35,
      markerElevation: 0.02,
      markers,
      arcs: TALENT_HUBS.map((hub) => ({ from: HUB, to: hub.location })),
    });

    const onResize = () => {
      width = wrapper.offsetWidth;
      globe.update({ width: width * 2, height: width * 2 });
    };
    window.addEventListener("resize", onResize);

    const frame = () => {
      if (pointerInteracting.current === null) {
        phi += 0.0032;
      }

      // Gentle pulse on each talent marker so the network reads as "live".
      const t = Date.now() / 1000;
      const pulsedMarkers = markers.map((m, i) =>
        i === 0
          ? m
          : { ...m, size: m.size * (0.7 + 0.4 * Math.sin(t * 1.5 + i)) }
      );

      globe.update({
        phi: phi + pointerInteractionMovement.current,
        markers: pulsedMarkers,
      });
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="relative mx-auto flex h-[280px] w-[280px] items-center justify-center sm:h-[340px] sm:w-[340px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-passport-sky/40 via-voyage-blue/20 to-transparent blur-2xl" />
        <div className="relative h-full w-full rounded-full bg-gradient-to-br from-[#CFE3FA] to-[#9FC3EE] shadow-inner" />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto h-[280px] w-[280px] sm:h-[340px] sm:w-[340px]"
    >
      <div
        className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-passport-sky/25 via-cloud-blue to-transparent blur-2xl"
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          setDragging(true);
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          setDragging(false);
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          setDragging(false);
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current += delta * 0.005;
            pointerInteracting.current = e.clientX;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current += delta * 0.005;
            pointerInteracting.current = e.touches[0].clientX;
          }
        }}
        className={`h-full w-full ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ contain: "layout paint size" }}
        aria-label="Interactive globe showing WaeWork's global talent network"
        role="img"
      />
    </div>
  );
}
