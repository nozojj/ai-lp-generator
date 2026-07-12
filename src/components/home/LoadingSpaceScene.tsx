"use client";

import { motion } from "framer-motion";

const STARS = Array.from({ length: 40 }, (_, i) => ({
  top: (i * 37) % 100,
  left: (i * 53) % 100,
  size: (i % 3) + 1,
  delay: (i % 10) * 0.3,
}));

const SHOOTING_STARS = [
  { top: 8, left: 75, dx: -260, dy: 160, delay: 0, duration: 1.6 },
  { top: 20, left: 95, dx: -220, dy: 130, delay: 2.2, duration: 1.4 },
  { top: 55, left: 25, dx: -200, dy: 120, delay: 4.4, duration: 1.8 },
  { top: 70, left: 65, dx: -240, dy: 150, delay: 1.2, duration: 1.5 },
  { top: 15, left: 45, dx: -210, dy: 130, delay: 5.8, duration: 1.7 },
];

export default function LoadingSpaceScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((star, i) => (
        <motion.span
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {SHOOTING_STARS.map((star, i) => (
        <motion.span
          key={`shooting-${i}`}
          className="absolute h-px w-24 rotate-[30deg] rounded-full bg-gradient-to-r from-transparent via-cyan-200 to-transparent"
          style={{ top: `${star.top}%`, left: `${star.left}%` }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: [0, star.dx], y: [0, star.dy], opacity: [0, 1, 0] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            repeatDelay: 3,
            ease: "easeIn",
          }}
        />
      ))}

      <div className="absolute -right-16 -bottom-16 h-56 w-56 sm:h-64 sm:w-64">
        <motion.div
          className="absolute inset-0 rounded-full shadow-[0_0_80px_rgba(34,211,238,.35)]"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #a5f3fc 0%, #22d3ee 22%, #0e7490 55%, #0f172a 85%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        <div
          className="absolute top-1/2 left-1/2 h-16 w-full rounded-full border border-cyan-200/30"
          style={{ transform: "translate(-50%, -50%) rotate(-18deg) scaleY(0.28)" }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_8px_2px_rgba(165,243,252,.8)]"
          animate={{
            x: [0, 90, 0, -90, 0],
            y: [-18, -6, 18, -6, -18],
            opacity: [1, 0.6, 1, 0.6, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
