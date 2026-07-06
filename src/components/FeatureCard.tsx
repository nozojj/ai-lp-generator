"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
};

export default function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: Props) {
  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 14;

    const rotateX = -(y / rect.height - 0.5) * 14;

    setRotate({
      x: rotateX,
      y: rotateY,
    });
  };

  const handleMouseLeave = () => {
    setRotate({
      x: 0,
      y: 0,
    });
  };
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
        delay,
      }}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <Card className="group relative h-full overflow-hidden rounded-3xl border border-cyan-500/20 bg-zinc-900/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,.35)]">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        <CardContent className="relative p-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_30px_rgba(34,211,238,.6)]">
            {icon}
          </div>

          <h3 className="text-foreground text-xl font-bold transition-colors duration-300 group-hover:text-cyan-300">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
