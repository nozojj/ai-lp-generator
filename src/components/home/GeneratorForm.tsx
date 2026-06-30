import { BrainCircuit, Building2, Check, CreditCard, Loader2, Sparkles } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";

type GeneratorFormProps = {
  loading: boolean;
  credits: number | null;
  isSignedIn: boolean;

  business: string;
  setBusiness: Dispatch<SetStateAction<string>>;

  target: string;
  setTarget: Dispatch<SetStateAction<string>>;

  atmosphere: string;
  setAtmosphere: Dispatch<SetStateAction<string>>;

  template: string;
  setTemplate: Dispatch<SetStateAction<string>>;

  activeStep: number;
  status: string[];

  handleGenerate: () => void;
};

export default function GeneratorForm({
  loading,
  credits,
  isSignedIn,
  business,
  setBusiness,
  target,
  setTarget,
  atmosphere,
  setAtmosphere,
  template,
  setTemplate,
  activeStep,
  status,
  handleGenerate,
}: GeneratorFormProps) {
  return (
      <Card className="mx-auto mt-6 max-w-xl rounded-3xl border border-cyan-500/20 bg-zinc-900/40 shadow-[0_20px_80px_rgba(34,211,238,.12)] backdrop-blur-xl">
        <CardContent className="space-y-4 p-6">
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="h-2 w-2 rounded-full bg-cyan-400"
              />

              <span className="text-sm font-medium text-cyan-300">
                {loading ? status[activeStep] : "AI Ready"}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-zinc-800/80 px-3 py-1 text-xs text-zinc-300">
              <CreditCard size={14} className="text-cyan-300" />
              Credits
              <span className="font-bold text-cyan-300">{credits ?? "--"}</span>
            </div>
          </div>
          <div className="relative">
            <Building2
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-cyan-400"
            />

            <Input
              placeholder="業種（例：パーソナルジム）"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className="h-14 rounded-2xl border-cyan-500/20 bg-zinc-900/40 pl-12 text-white backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(34,211,238,.15)] focus-visible:border-cyan-400 focus-visible:shadow-[0_0_25px_rgba(34,211,238,.35)] focus-visible:ring-2 focus-visible:ring-cyan-400/30"
            />
          </div>
          <div className="relative">
            <BrainCircuit
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-cyan-400"
            />

            <Input
              placeholder="ターゲット（例：20代女性）"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="h-14 rounded-2xl border-cyan-500/20 bg-zinc-900/40 pl-12 text-white backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(34,211,238,.15)] focus-visible:border-cyan-400 focus-visible:shadow-[0_0_25px_rgba(34,211,238,.35)] focus-visible:ring-2 focus-visible:ring-cyan-400/30"
            />
          </div>
          <div className="relative">
            <Sparkles
              size={18}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-cyan-400"
            />

            <div className="space-y-2">
              <Label htmlFor="template">テンプレート</Label>

              <select
                id="template"
                aria-label="テンプレート"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="h-14 w-full rounded-2xl border border-cyan-500/20 bg-zinc-900/40 px-4 text-white"
              >
                <option value="modern">Modern</option>
                <option value="luxury">Luxury</option>
                <option value="minimal">Minimal</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>

            <Input
              placeholder="雰囲気（例：高級感）"
              value={atmosphere}
              onChange={(e) => setAtmosphere(e.target.value)}
              className="h-14 rounded-2xl border-cyan-500/20 bg-zinc-900/40 pl-12 text-white backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(34,211,238,.15)] focus-visible:border-cyan-400 focus-visible:shadow-[0_0_25px_rgba(34,211,238,.35)] focus-visible:ring-2 focus-visible:ring-cyan-400/30"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={
              !isSignedIn ||
              loading ||
              credits === null ||
              !business ||
              !target ||
              !atmosphere ||
              credits === 0
            }
            className={`group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 font-semibold text-white transition-all duration-300 before:absolute before:inset-0 before:bg-cyan-400/10 before:opacity-0 before:transition-opacity before:duration-500 hover:scale-[1.02] hover:shadow-[0_0_70px_rgba(34,211,238,.55)] hover:brightness-110 hover:before:opacity-100 active:scale-[0.98] ${loading ? "animate-pulse shadow-[0_0_50px_rgba(34,211,238,.45)]" : ""} `}
          >
            {/* 光が流れる */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1400 group-hover:translate-x-[450%]" />
            </div>
            {loading ? (
              <span className="relative z-10 flex items-center justify-center gap-2">
                {activeStep === 4 ? (
                  <>
                    <Check size={16} className="text-cyan-300" />
                    <span className="text-cyan-300">Ready</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                    <span className="text-white">{status[activeStep]}</span>
                  </>
                )}
              </span>
            ) : !isSignedIn ? (
              <span className="relative z-10">ログインしてください</span>
            ) : credits === null ? (
              <span className="relative z-10">確認中...</span>
            ) : credits === 0 ? (
              <span className="relative z-10">クレジット不足</span>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 12, -12, 0],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles
                    size={18}
                    className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12"
                  />
                </motion.div>
                <span>AIでLPを生成</span>
              </span>
            )}
          </Button>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: "0%" }}
              animate={{
                width:
                  activeStep === 0
                    ? "20%"
                    : activeStep === 1
                      ? "40%"
                      : activeStep === 2
                        ? "60%"
                        : activeStep === 3
                          ? "85%"
                          : "100%",
              }}
              transition={{
                duration: 0.8,
              }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300"
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-zinc-500">
            <span className="relative z-10 flex items-center gap-2">
              {status[activeStep]}
            </span>

            <span>{activeStep + 1}/5</span>
          </div>
          <p className="mt-3 text-center text-xs text-zinc-500">
            約10秒でLP・コピー・画像を生成します
          </p>
        </CardContent>
      </Card>
  );
}
