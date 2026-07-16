import { useEffect, useState } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, Hourglass } from "lucide-react";
import LoadingSpaceScene from "./LoadingSpaceScene";
import AiThinkingCore from "./AiThinkingCore";

type LoadingDialogProps = {
  loading: boolean;
  activeStep: number;
  status: string[];
};

const STEP_LABELS = [
  "ターゲット分析中",
  "キャッチコピー作成中",
  "セクション構成を生成中",
  "デザインを最適化中",
  "完成データを保存中",
];

function LoadingDialogContent({ activeStep }: { activeStep: number }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const isDone = activeStep >= STEP_LABELS.length - 1;
    const target = isDone
      ? 100
      : Math.round(((activeStep + 1) / STEP_LABELS.length) * 100);

    const controls = animate(percent, target, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (value) => setPercent(Math.round(value)),
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-zinc-950/90 p-8 shadow-[0_0_60px_rgba(34,211,238,.2)]"
    >
      <AiThinkingCore />

      <h2 className="mb-8 text-center text-2xl font-bold text-white">
        LPを生成しています...
      </h2>

      {/* ステップ一覧 */}
      <div className="mb-8 space-y-4">
        {STEP_LABELS.map((label, index) => {
          const isCompleted = index < activeStep;
          const isCurrent = index === activeStep;

          return (
            <div
              key={label}
              className={`flex items-center gap-3 transition-colors ${
                isCompleted
                  ? "text-emerald-400"
                  : isCurrent
                    ? "text-cyan-300"
                    : "text-zinc-600"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={18} />
              ) : isCurrent ? (
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <Hourglass size={18} />
                </motion.div>
              ) : (
                <Circle size={18} />
              )}

              <span className="font-medium">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300"
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p className="text-center text-3xl font-bold text-cyan-300">
        {percent}%
      </p>
    </motion.div>
  );
}

export default function LoadingDialog({
  loading,
  activeStep,
}: LoadingDialogProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <LoadingSpaceScene />

          <LoadingDialogContent activeStep={activeStep} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
