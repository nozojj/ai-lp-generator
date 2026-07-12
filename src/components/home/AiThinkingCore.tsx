"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  angle: (i / 6) * 360,
  delay: i * 0.15,
}));

export default function AiThinkingCore() {
  return (
    <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`ring-${i}`}
          className="absolute inset-0 rounded-full border border-cyan-400/60"
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}

      {PARTICLES.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute inset-0"
          initial={{ rotate: p.angle }}
          animate={{ rotate: p.angle + 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          <span
            className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_6px_2px_rgba(103,232,249,.8)]"
            style={{ transform: "translate(-50%, -50%) translateY(-38px)" }}
          />
        </motion.div>
      ))}

      <motion.div
        className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(34,211,238,.7)]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
