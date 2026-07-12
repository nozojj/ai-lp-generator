"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useIsCoarsePointer } from "@/hooks/useIsCoarsePointer";

// Loaded lazily, client-only: mounting the WebGL Canvas (with Bloom
// postprocessing) is a known iOS Safari crash trigger, so it must never be
// referenced/imported before we've confirmed the device isn't coarse-pointer.
const HeroBackgroundScene = dynamic(() => import("./HeroBackgroundScene"), {
  ssr: false,
});

function FallbackGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-blue-600/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
    </div>
  );
}

export default function HeroBackground() {
  const [mounted, setMounted] = useState(false);
  const isCoarsePointer = useIsCoarsePointer();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing until after mount so this never differs from the
  // server-rendered output, and so the coarse-pointer check (already
  // resolved by the time this flips) is guaranteed correct before the
  // WebGL branch can ever be selected.
  if (!mounted) {
    return null;
  }

  if (isCoarsePointer) {
    return <FallbackGradient />;
  }

  return <HeroBackgroundScene />;
}
