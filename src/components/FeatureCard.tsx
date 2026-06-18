"use client";

import { ReactNode } from "react";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
    >
      <Card className="group h-full border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
        <CardContent className="p-6 text-center">
          <div className="mb-3 flex justify-center text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
            {icon}
          </div>

          <h3 className="text-lg font-bold text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}