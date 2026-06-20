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
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        },
      }}
      whileHover={{
        y: -10,
        scale: 1.04,
        transition: {
          type: "spring",
          stiffness: 350,
          damping: 18,
        },
      }}
    >
      <Card
        className={`group relative h-full overflow-hidden rounded-3xl border border-cyan-500/20 bg-zinc-900/40 backdrop-blur-xl transition-colors duration-500 ${
          active
            ? "scale-105 border-cyan-400 bg-cyan-500/10 shadow-[0_0_60px_rgba(34,211,238,.45)]"
            : ""
        } hover:border-cyan-400/50`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative p-8 text-center">
          <p className="font-bold text-cyan-400">{number}</p>

          <div
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(34,211,238,.5)] ${
              active ? "scale-125 shadow-[0_0_25px_rgba(34,211,238,.7)]" : ""
            } `}
          >
            {icon}
          </div>

          <h3 className="mt-6 text-2xl font-bold transition-colors duration-300 group-hover:text-cyan-300">
            {title}
          </h3>

          <p className="mt-3 text-zinc-400">{description}</p>
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 group-hover:w-full" />
        </div>
      </Card>
    </motion.div>
  );
}
