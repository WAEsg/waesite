"use client";

import { useEffect, useRef } from "react";
import { createGlobe, type GlobeHandle } from "./engine";

// React wrapper around the ported prototype globe engine (engine.ts).
// The canvas fills its parent; the engine reads size from the element
// itself via ResizeObserver, so no width/height props are needed here.
export function PrototypeGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<GlobeHandle | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handle = createGlobe(canvas);
    handleRef.current = handle;
    handle.start();
    return () => {
      handle.destroy();
      handleRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full touch-none [&.is-grabbing]:cursor-grabbing ${className}`}
      style={{ cursor: "grab" }}
      aria-hidden="true"
    />
  );
}
