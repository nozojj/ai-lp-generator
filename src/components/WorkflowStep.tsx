import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
  active?: boolean;
};

export default function WorkflowStep({
  number,
  title,
  description,
  icon,
  delay = 0,
  active = false,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
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
      <Card
        className={`group h-full border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-700 ${
          active
            ? "scale-105 border-cyan-400 bg-cyan-500/10 shadow-[0_0_60px_rgba(34,211,238,.45)]"
            : ""
        } hover:border-cyan-400/50`}
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />
        <div className="p-8">
          <p className="font-bold text-cyan-400">{number}</p>

          <div
            className={`mb-4 text-cyan-400 transition-all duration-500 ${
              active ? "scale-125 drop-shadow-[0_0_20px_rgb(34,211,238)]" : ""
            } `}
          >
            {icon}
          </div>

          <h3 className="mt-6 text-2xl font-bold">{title}</h3>

          <p className="mt-3 text-zinc-400">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}
