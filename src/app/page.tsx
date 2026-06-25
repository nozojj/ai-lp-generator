"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Building2,
  BrainCircuit,
  PenTool,
  ImageIcon,
  FileCode2,
  Zap,
  Palette,
  CreditCard,
  Check,
  Sparkles,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthButtons from "@/components/auth-button";
import AuroraBackground from "@/components/AuroraBackground";
import WorkflowStep from "@/components/WorkflowStep";
import FeatureCard from "@/components/FeatureCard";
import HeroCard from "@/components/HeroCard";
import HeroBackground from "@/components/HeroBackground";

type ResultType = {
  hero: string;
  cta: string;
  imageUrl?: string;
  features: string[];
  benefits: string[];
  faq: {
    question: string;
    answer: string;
  }[];
};

//代用
const previewResult = {
  hero: "AIが作る高品質なランディングページ",
  cta: "今すぐ無料で始める",
  imageUrl: "/hero-ai.jpg",
  benefits: ["AIが最適な構成を提案", "画像も自動生成", "SEOにも対応"],
  features: [
    "LP構成を自動生成",
    "コピーライティング生成",
    "ヒーロー画像生成",
    "HTMLエクスポート",
  ],
  faq: [
    {
      question: "生成にはどれくらい時間がかかりますか？",
      answer: "通常10秒程度です。",
    },
    {
      question: "無料で使えますか？",
      answer: "無料クレジットで試せます。",
    },
  ],
};

export default function Home() {
  const router = useRouter();

  const [mouseLight, setMouseLight] = useState({
    x: 0,
    y: 0,
  });

  const [targetParallax, setTargetParallax] = useState({
    x: 0,
    y: 0,
  });

  const [mouseParallax, setMouseParallax] = useState({
    x: 0,
    y: 0,
  });

  const [credits, setCredits] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [displayStep, setDisplayStep] = useState(0);
  const { isSignedIn } = useUser();

  const [business, setBusiness] = useState("");
  const [target, setTarget] = useState("");
  const [atmosphere, setAtmosphere] = useState("");

  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageRotate, setImageRotate] = useState({
    x: 0,
    y: 0,
  });
  //結果の代用
  const displayResult = result ?? previewResult;
  //デモ
  const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  useEffect(() => {
    const fetchCredits = async () => {
      const response = await fetch("/api/user");

      const data = await response.json();

      setCredits(data.credits);
      setIsPro(data.isPro);
    };

    fetchCredits();
  }, []);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? prev : prev + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setMouseParallax((prev) => ({
        x: prev.x + (targetParallax.x - prev.x) * 0.08,
        y: prev.y + (targetParallax.y - prev.y) * 0.08,
      }));

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    const duration = displayStep === 0 ? 2200 : displayStep === 4 ? 2800 : 1500;

    const timeout = setTimeout(() => {
      setDisplayStep((prev) => (prev === 4 ? 0 : prev + 1));
    }, duration);

    return () => clearTimeout(timeout);
  }, [displayStep]);

  const status = [
    "Analyzing Business...",
    "Researching Target...",
    "Writing Copy...",
    "Generating Hero Image...",
    "Ready",
  ];

  const handleGenerate = async () => {
    if (DEMO_MODE) {
      setLoading(true);
      setActiveStep(0);

      await new Promise((resolve) => setTimeout(resolve, 6000));

      setResult(previewResult);
      setLoading(false);

      return;
    }
    setActiveStep(0);
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business,
          target,
          atmosphere,
        }),
      });

      if (!response.ok) {
        toast.error("生成失敗");
        throw new Error("API Error");
      }

      const data = await response.json();

      toast.success("生成成功");

      router.push(`/history/${data.id}`);
    } catch (error) {
      console.log(error);

      toast.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const benefitIcons = [Sparkles, Rocket, ShieldCheck];

  const featureIcons = [Zap, PenTool, ImageIcon, FileCode2];

  const featureDescriptions = [
    "AIが業種やターゲットを分析し、最適なLP構成を自動生成します。",
    "CV率を意識した魅力的なコピーをAIが自動で作成します。",
    "ブランドイメージに合わせたヒーロー画像をAIが生成します。",
    "生成したLPをHTMLとしてダウンロードできます。",
  ];

  const heroWords = displayResult?.hero.split("") ?? [];

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-6 text-white"
      onMouseMove={(e) => {
        setMouseLight({
          x: e.clientX,
          y: e.clientY,
        });
      }}
    >
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-zinc-950/90 p-8 shadow-[0_0_60px_rgba(34,211,238,.2)]">
            {/* <h2 className="mb-2 text-2xl font-bold text-white">
              🤖 AI is Building Your Landing Page
            </h2>

            <p className="mb-8 text-zinc-400">Please wait a few seconds...</p> */}

            {/*デモ版*/}
            <h2 className="mb-2 text-2xl font-bold text-white">
              {DEMO_MODE
                ? "🚀 Demo Generation"
                : "🤖 AI is Building Your Landing Page"}
            </h2>

            <p className="mb-8 text-zinc-400">
              {DEMO_MODE
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

            {DEMO_MODE && (
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
      )}
      <div className="absolute inset-0">
        <HeroBackground />
      </div>
      <div
        className="pointer-events-none fixed h-96 w-96 rounded-full bg-blue-500/20 blur-3xl transition-all duration-150"
        style={{
          left: mouseLight.x - 192,
          top: mouseLight.y - 192,
        }}
      />
      <div
        className="pointer-events-none fixed h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
        style={{
          left: mouseLight.x - 300,
          top: mouseLight.y - 300,
        }}
      />
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-16 text-center"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();

            setTargetParallax({
              x: (e.clientX - rect.left - rect.width / 2) / 40,
              y: (e.clientY - rect.top - rect.height / 2) / 40,
            });
          }}
          onMouseLeave={() =>
            setTargetParallax({
              x: 0,
              y: 0,
            })
          }
        >
          <div
            className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
            style={{
              transform: `translate(${mouseParallax.x * 2}px, ${mouseParallax.y * 2}px)`,
            }}
          >
            AIでLP・画像・HTMLを自動生成
          </div>

          <h1
            className="mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-6xl font-bold text-transparent"
            style={{
              transform: `translate(${mouseParallax.x * 2}px, ${mouseParallax.y * 2}px)`,
            }}
          >
            AI LP Generator
          </h1>

          <div className="mt-8 flex justify-center gap-10 text-center">
            <div
              style={{
                transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
              }}
            >
              <p className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                100+ Generated LPs
              </p>
              <p className="text-sm text-zinc-500">生成LP</p>
            </div>

            <div
              style={{
                transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
              }}
            >
              <p className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                AI Powered
              </p>
              <p className="text-sm text-zinc-500">Powered</p>
            </div>

            <div
              style={{
                transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
              }}
            >
              <p className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                24/7 Available
              </p>
              <p className="text-sm text-zinc-500">Available</p>
            </div>
          </div>
          <HeroCard mouseParallax={mouseParallax} />
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          業種・ターゲット・雰囲気を入力するだけで、
          LP構成とヒーロー画像を数秒で生成します。
        </p>
      </div>

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
              <div className="flex items-center justify-between border-b border-cyan-500/20 bg-zinc-900/80 px-5 py-3">
                {/* 左：Mac風ボタン */}
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>

                {/* 真ん中：URLバー */}
                <div className="flex w-[420px] items-center justify-center rounded-full border border-cyan-500/20 bg-zinc-800 px-4 py-1 text-xs text-zinc-500">
                  https://generated-ai-lp.vercel.app
                </div>

                {/* 右：ダミーアイコン */}
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400/60" />
                  <div className="h-2 w-2 rounded-full bg-cyan-400/30" />
                </div>
              </div>

              <CardContent className="grid items-center gap-12 p-14 md:grid-cols-[1.2fr_1fr]">
                <div className="text-center md:text-left">
                  <p className="mb-3 text-sm font-medium text-cyan-300">
                    AI Generated Preview
                  </p>

                  <h1 className="max-w-xl bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-5xl leading-tight font-bold text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,.25)] md:text-6xl">
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
                    <Button className="group relative mt-10 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-12 text-xl font-bold shadow-[0_0_40px_rgba(34,211,238,.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_70px_rgba(34,211,238,.8)]">
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
    </main>
  );
}
