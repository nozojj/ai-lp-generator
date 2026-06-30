import {
  BrainCircuit,
  Building2,
  Check,
  CreditCard,
  FileCode2,
  ImageIcon,
  Loader2,
  Palette,
  PenTool,
  Zap,
} from "lucide-react";
import WorkflowStep from "../WorkflowStep";
import FeatureCard from "../FeatureCard";
import { motion } from "framer-motion";

type HowItWorksSectionProps = {
  displayStep: number;
  status: string[];
};

export default function HowItWorksSection({
  displayStep,
  status,
}: HowItWorksSectionProps) {
  return (
    <>
      <section className="relative mx-auto mt-32 max-w-6xl">
        <div className="absolute inset-0 -z-10 rounded-[40px] bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-3xl" />
        <h2 className="text-center text-5xl font-bold">
          How AI Creates Your Landing Page
        </h2>

        <p className="mt-4 text-center text-zinc-400">
          AIが分析からコピー・画像・HTML生成までを自動化します。
        </p>

        <div className="mx-auto mt-20 grid max-w-5xl gap-8 perspective-[1000px] md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            delay={0}
            icon={<Zap size={42} strokeWidth={1.8} />}
            title="LP構成生成"
            description="AIがLP構成を自動作成"
          />

          <FeatureCard
            delay={0.15}
            icon={<Palette size={42} strokeWidth={1.8} />}
            title="AI画像生成"
            description="ヒーロー画像を自動生成"
          />

          <FeatureCard
            delay={0.3}
            icon={<CreditCard size={42} strokeWidth={1.8} />}
            title="Stripe決済"
            description="サブスク課金対応"
          />

          <FeatureCard
            delay={0.45}
            icon={<FileCode2 size={42} strokeWidth={1.8} />}
            title="HTML出力"
            description="コードとして保存可能"
          />
        </div>

        <div className="relative mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <WorkflowStep
              active={displayStep === 0}
              delay={0}
              number="01"
              icon={<Building2 size={42} strokeWidth={1.8} />}
              title="Business"
              description="業種・ターゲット・雰囲気を入力"
            />
            <div
              className={`absolute top-[96px] left-full hidden h-[2px] w-16 overflow-hidden rounded-full xl:block ${
                displayStep >= 1 ? "bg-cyan-500/30" : "bg-zinc-700/40"
              }`}
            >
              {displayStep === 0 && (
                <div className="flow-light absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
              )}
            </div>
          </div>
          <div className="relative">
            <WorkflowStep
              active={displayStep === 1}
              delay={0.15}
              number="02"
              icon={<BrainCircuit size={42} strokeWidth={1.8} />}
              title="AI Analysis"
              description="ターゲット・競合・USPを分析"
            />
            <div
              className={`absolute top-[96px] left-full hidden h-[2px] w-16 overflow-hidden rounded-full xl:block ${
                displayStep >= 2 ? "bg-cyan-500/30" : "bg-zinc-700/40"
              }`}
            >
              {displayStep === 1 && (
                <div className="flow-light absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
              )}
            </div>
          </div>
          <div className="relative">
            <WorkflowStep
              active={displayStep === 2}
              delay={0.3}
              number="03"
              icon={<PenTool size={42} strokeWidth={1.8} />}
              title="Copy"
              description="AIがコピーを生成"
            />
            <div
              className={`absolute top-[96px] left-full hidden h-[2px] w-16 overflow-hidden rounded-full xl:block ${
                displayStep >= 3 ? "bg-cyan-500/30" : "bg-zinc-700/40"
              }`}
            >
              {displayStep === 2 && (
                <div className="flow-light absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
              )}
            </div>
          </div>
          <div className="relative">
            <WorkflowStep
              active={displayStep === 3}
              delay={0.45}
              number="04"
              icon={<ImageIcon size={42} strokeWidth={1.8} />}
              title="Image"
              description="AIがヒーロー画像を生成"
            />
            <div
              className={`absolute top-[96px] left-full hidden h-[2px] w-16 overflow-hidden rounded-full xl:block ${
                displayStep >= 4 ? "bg-cyan-500/30" : "bg-zinc-700/40"
              }`}
            >
              {displayStep === 3 && (
                <div className="flow-light absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
              )}
            </div>
          </div>
          <div className="relative">
            <WorkflowStep
              active={displayStep === 4}
              delay={0.6}
              number="05"
              icon={<FileCode2 size={42} strokeWidth={1.8} />}
              title="Export"
              description="HTMLとして出力"
            />

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 15,
              }}
              className="absolute -top-3 -right-3"
            >
              {/* 波紋 */}
              {displayStep === 4 && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-300"
                  animate={{
                    scale: [1, 2.8],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}

              {/* 本体 */}
              <div
                className={`relative rounded-full p-2 transition-all duration-500 ${
                  displayStep === 4
                    ? "bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,.9)]"
                    : "bg-zinc-700"
                } `}
              >
                {displayStep === 4 ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <Loader2 size={18} className="animate-spin text-cyan-300" />
                )}
              </div>
              <motion.div
                key={displayStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`absolute top-1/2 left-10 -translate-y-1/2 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap backdrop-blur-md transition-all duration-500 ${
                  displayStep === 4
                    ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,.35)]"
                    : "border-zinc-700 bg-zinc-900/60"
                } `}
              >
                <motion.span
                  key={displayStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-2 ${
                    displayStep === 4
                      ? "text-cyan-300"
                      : "animate-pulse text-zinc-400"
                  }`}
                >
                  <>
                    {displayStep === 4 && <Check size={14} />}
                    {displayStep === 4 ? "Ready" : status[displayStep]}
                  </>
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
