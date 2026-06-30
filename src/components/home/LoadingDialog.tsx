import { motion } from "framer-motion";

type LoadingDialogProps = {
  loading: boolean;
  activeStep: number;
  status: string[];
  demoMode: boolean;
};

export default function LoadingDialog({
  loading,
  activeStep,
  status,
  demoMode,
}: LoadingDialogProps) {
  if (!loading) return null;

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-zinc-950/90 p-8 shadow-[0_0_60px_rgba(34,211,238,.2)]">
            {/* <h2 className="mb-2 text-2xl font-bold text-white">
                    🤖 AI is Building Your Landing Page
                  </h2>
      
                  <p className="mb-8 text-zinc-400">Please wait a few seconds...</p> */}

            {/*デモ版*/}
            <h2 className="mb-2 text-2xl font-bold text-white">
              {demoMode
                ? "🚀 Demo Generation"
                : "🤖 AI is Building Your Landing Page"}
            </h2>

            <p className="mb-8 text-zinc-400">
              {demoMode
                ? "Simulating AI generation..."
                : "Please wait a few seconds..."}
            </p>

            {/* Progress Bar */}
            <div className="mb-6 h-3 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                animate={{
                  width: `${((activeStep + 1) / 5) * 100}%`,
                }}
                transition={{ duration: 0.6 }}
              />
            </div>

            {demoMode && (
              <div className="mb-6 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-center text-xs text-cyan-300">
                🚀 Demo Mode（APIは呼び出していません）
              </div>
            )}

            {/* 現在の処理 */}
            <p className="mb-6 text-center font-medium text-cyan-300">
              {status[activeStep]}
            </p>

            {/* ステップ一覧 */}
            <div className="space-y-3">
              {status.map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-3 transition-colors ${
                    index <= activeStep ? "text-cyan-300" : "text-zinc-600"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      index <= activeStep ? "bg-cyan-400" : "bg-zinc-700"
                    }`}
                  />

                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  );
}
