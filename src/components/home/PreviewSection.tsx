import { Dispatch, SetStateAction } from "react";
import { Check, Sparkles, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import type { Result } from "@/types/result";
import { getTemplateTheme } from "@/lib/template-theme";

type PreviewSectionProps = {
  displayResult: Result;
  heroWords: string[];
  business: string;
  target: string;
  template: string;
  isLive: boolean;

  imageRotate: {
    x: number;
    y: number;
  };

  setImageRotate: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
    }>
  >;

  benefitIcons: LucideIcon[];
  featureIcons: LucideIcon[];
  featureDescriptions: string[];
};

export default function PreviewSection({
  displayResult,
  heroWords,
  business,
  target,
  template,
  isLive,
  imageRotate,
  setImageRotate,
  benefitIcons,
  featureIcons,
  featureDescriptions,
}: PreviewSectionProps) {
  const theme = getTemplateTheme(template);
  return (
    <>
      {displayResult && (
        <>
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Card className="overflow-hidden rounded-3xl border border-cyan-500/30 bg-zinc-950/80 shadow-[0_0_70px_rgba(34,211,238,.25)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 border-b border-cyan-500/20 bg-zinc-900/80 px-3 py-3 sm:px-5">
                {/* 左：Mac風ボタン */}
                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>

                {/* 真ん中：URLバー */}
                <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-full border border-cyan-500/20 bg-zinc-800 px-4 py-1 text-xs text-nowrap text-ellipsis text-zinc-500 sm:max-w-105">
                  https://generated-ai-lp.vercel.app
                </div>

                {/* 右：ダミーアイコン */}
                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400/60" />
                  <div className="h-2 w-2 rounded-full bg-cyan-400/30" />
                </div>
              </div>

              <CardContent className="grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[1.2fr_1fr] md:gap-12 md:p-14">
                <div className="text-center md:text-left">
                  <p className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-cyan-300 md:justify-start">
                    {isLive && (
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="h-2 w-2 rounded-full bg-cyan-400"
                      />
                    )}
                    {isLive ? "ライブプレビュー" : "AI Generated Preview"}
                  </p>

                  <h1
                    className={`max-w-xl bg-gradient-to-r ${theme.heroGradient} bg-clip-text text-3xl leading-tight font-bold text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,.25)] sm:text-5xl md:text-6xl`}
                  >
                    {heroWords.map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{
                          opacity: 0,
                          y: 30,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.04,
                          duration: 0.35,
                        }}
                        whileHover={{
                          scale: 1.15,
                          color: "#67e8f9",
                        }}
                        className="inline-block"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </h1>
                  <p className="mx-auto mt-6 max-w-xl text-zinc-300">
                    {target || "20代女性"}向けの
                    {business || "AI LP Generator"}
                  </p>
                  <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
                    AIが数秒でLP・コピー・画像を自動生成。
                    面倒な制作工程を一瞬で完了します。
                  </p>
                  <div className="mt-10 flex justify-center md:justify-start">
                    <Button
                      className={`group relative mt-10 h-12 rounded-2xl bg-gradient-to-r ${theme.ctaGradient} px-6 text-base font-bold shadow-[0_0_40px_rgba(34,211,238,.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_70px_rgba(34,211,238,.8)] sm:h-16 sm:px-12 sm:text-xl`}
                      style={{
                        boxShadow: `0 0 40px ${theme.glow}`,
                      }}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <motion.div
                          animate={{
                            x: ["-150%", "250%"],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        />
                      </div>

                      <span className="relative z-10 flex items-center gap-2">
                        <Sparkles size={18} />
                        {displayResult.cta}
                      </span>
                    </Button>
                  </div>
                </div>

                <div
                  className="relative"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();

                    const x =
                      ((e.clientY - rect.top) / rect.height - 0.5) * -10;
                    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 10;

                    setImageRotate({ x, y });
                  }}
                  onMouseLeave={() =>
                    setImageRotate({
                      x: 0,
                      y: 0,
                    })
                  }
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.02, 1],
                      rotate: [0, 1, 0, -1, 0],
                      rotateX: imageRotate.x,
                      rotateY: imageRotate.y,
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative transform-gpu"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <Image
                      src={displayResult.imageUrl ?? "/hero-ai.jpg"}
                      alt="AI Hero"
                      width={760}
                      height={850}
                      className="mx-auto w-full max-w-2xl rounded-3xl border border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,.25)]"
                    />
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      <motion.div
                        animate={{
                          x: ["-150%", "250%"],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-sm"
                      />
                    </div>
                  </motion.div>
                  <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
                  </div>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                  {displayResult.benefits.map((item, index) => {
                    const Icon = benefitIcons[index % benefitIcons.length];

                    return (
                      <motion.div
                        key={index}
                        whileHover={{
                          y: -10,
                          scale: 1.03,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                        className="rounded-2xl border border-cyan-500/20 bg-zinc-900/50 p-6"
                      >
                        <motion.div
                          className="mb-4 flex justify-center text-cyan-300"
                          whileHover={{
                            rotate: 12,
                            scale: 1.2,
                          }}
                        >
                          <Icon size={32} />
                        </motion.div>

                        <h3 className="font-bold text-white">{item}</h3>

                        <p className="mt-2 text-sm text-zinc-400">
                          AIが最適な構成を自動で提案します。
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
            }}
            className="mt-10 space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {displayResult.features.map((feature, index) => {
                const Icon = featureIcons[index] ?? Check;

                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 40,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15,
                    }}
                    viewport={{
                      once: true,
                    }}
                  >
                    <Card className="group relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-zinc-900/60 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,.35)]">
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                        <div className="absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[90px]" />

                        <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-blue-500/20 blur-[80px]" />
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_30px_rgba(34,211,238,.7)]">
                          <Icon size={22} />
                        </div>

                        <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
                          {feature}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                          {featureDescriptions[index]}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
