"use client";

import { useEffect, useState } from "react";

export function useParallax() {
  const [mouseLight, setMouseLight] = useState({
    x: 0,
    y: 0,
  });

  const [targetParallax, setTargetParallax] = useState({
    x: 0,
    y: 0,
  });

  const [mouseParallax, setMouseParallax] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setMouseParallax((prev) => ({
        x: prev.x + (targetParallax.x - prev.x) * 0.08,
        y: prev.y + (targetParallax.y - prev.y) * 0.08,
      }));

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [targetParallax]);

  return {
    mouseLight,
    setMouseLight,
    mouseParallax,
    targetParallax,
    setTargetParallax,
  };
}
