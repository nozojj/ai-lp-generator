"use client";

import { useEffect, useRef, useState } from "react";

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

  const targetParallaxRef = useRef(targetParallax);

  useEffect(() => {
    targetParallaxRef.current = targetParallax;
  }, [targetParallax]);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setMouseParallax((prev) => ({
        x: prev.x + (targetParallaxRef.current.x - prev.x) * 0.08,
        y: prev.y + (targetParallaxRef.current.y - prev.y) * 0.08,
      }));

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return {
    mouseLight,
    setMouseLight,
    mouseParallax,
    targetParallax,
    setTargetParallax,
  };
}
