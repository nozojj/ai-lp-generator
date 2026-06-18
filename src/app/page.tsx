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
  features: string[];
  benefits: string[];
  faq: {
    question: string;
    answer: string;
  }[];
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
  const { isSignedIn } = useUser();

  const [business, setBusiness] = useState("");
  const [target, setTarget] = useState("");
  const [atmosphere, setAtmosphere] = useState("");

  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);

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

  const status = [
    "Analyzing Business...",
    "Researching Target...",
    "Writing Copy...",
    "Generating Hero Image...",
    "Building HTML...",
  ];

  const handleGenerate = async () => {
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
            <h2 className="mb-2 text-2xl font-bold text-white">
              🤖 AI is Building Your Landing Page
            </h2>

            <p className="mb-8 text-zinc-400">Please wait a few seconds...</p>

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

        <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              active={activeStep === 0}
              delay={0}
              number="01"
              icon={<Building2 size={42} strokeWidth={1.8} />}
              title="Business"
              description="業種・ターゲット・雰囲気を入力"
            />
            <div className="absolute top-[96px] left-full hidden h-[2px] w-16 overflow-hidden rounded-full bg-cyan-500/20 xl:block">
              <div className="flow-light absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
            </div>
          </div>
          <div className="relative">
            <WorkflowStep
              active={activeStep === 1}
              delay={0.15}
              number="02"
              icon={<BrainCircuit size={42} strokeWidth={1.8} />}
              title="AI Analysis"
              description="ターゲット・競合・USPを分析"
            />
            <div className="absolute top-[96px] left-full hidden h-[2px] w-16 overflow-hidden rounded-full bg-cyan-500/20 xl:block">
              <div className="flow-light absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
            </div>
          </div>
          <div className="relative">
            <WorkflowStep
              active={activeStep === 2}
              delay={0.3}
              number="03"
              icon={<PenTool size={42} strokeWidth={1.8} />}
              title="Copy"
              description="AIがコピーを生成"
            />
            <div className="absolute top-[96px] left-full hidden h-[2px] w-16 overflow-hidden rounded-full bg-cyan-500/20 xl:block">
              <div className="flow-light absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
            </div>
          </div>
          <div className="relative">
            <WorkflowStep
              active={activeStep === 3}
              delay={0.45}
              number="04"
              icon={<ImageIcon size={42} strokeWidth={1.8} />}
              title="Image"
              description="AIがヒーロー画像を生成"
            />
            <div className="absolute top-[96px] left-full hidden h-[2px] w-16 overflow-hidden rounded-full bg-cyan-500/20 xl:block">
              <div className="flow-light absolute h-full w-8 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
            </div>
          </div>
          <div className="relative">
            <WorkflowStep
              active={activeStep === 4}
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
              {activeStep === 4 && (
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
                  activeStep === 4
                    ? "bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,.9)]"
                    : "bg-zinc-700"
                } `}
              >
                {activeStep === 4 ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <Loader2 size={18} className="animate-spin text-cyan-300" />
                )}
              </div>
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`absolute top-1/2 left-10 -translate-y-1/2 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap backdrop-blur-md transition-all duration-500 ${
                  activeStep === 4
                    ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,.35)]"
                    : "border-zinc-700 bg-zinc-900/60"
                } `}
              >
                <motion.span
                  key={activeStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-2 ${
                    activeStep === 4
                      ? "text-cyan-300"
                      : "animate-pulse text-zinc-400"
                  }`}
                >
                  {activeStep === 4 && <Check size={14} />}

                  {status[activeStep]}
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Card className="mx-auto mt-6 max-w-xl border-white/10 bg-white/5 shadow-[0_0_50px_rgba(59,130,246,0.15)] backdrop-blur-xl">
        <CardContent className="space-y-4 p-6">
          <Input
            placeholder="業種（例：パーソナルジム）"
            className="text-white"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />

          <Input
            placeholder="ターゲット（例：20代女性）"
            className="text-white"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />

          <Input
            placeholder="雰囲気（例：高級感）"
            className="text-white"
            value={atmosphere}
            onChange={(e) => setAtmosphere(e.target.value)}
          />

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
            className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,.45)] active:scale-[0.98]"
          >
            {/* 光が流れる */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            {loading ? (
              <span
                className={`relative z-10 flex items-center justify-center gap-2 ${
                  activeStep === 4 ? "text-cyan-300" : "text-white"
                }`}
              >
                {activeStep === 4 ? (
                  <Check size={16} />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {status[activeStep]}
              </span>
            ) : !isSignedIn ? (
              <span className="relative z-10">ログインしてください</span>
            ) : credits === null ? (
              <span className="relative z-10">確認中...</span>
            ) : credits === 0 ? (
              <span className="relative z-10">クレジット不足</span>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles size={18} />
                LPを生成
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="mt-8 space-y-6">
          <Card className="border-zinc-700 bg-zinc-800">
            <CardContent className="p-10 text-center">
              <h1 className="text-4xl font-bold">{result.hero}</h1>

              <p className="mt-6 text-zinc-300">
                {target}向けの
                {business}
              </p>

              <Button className="mt-8">{result.cta}</Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-700 bg-zinc-800">
            <CardContent className="p-6">
              <h2 className="mb-2 text-xl font-bold">CTA</h2>
              <p className="text-lg leading-7 text-white">{result.cta}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {result.benefits.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">{item}</CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            {result.features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-700 p-4"
              >
                ✓ {feature}
              </div>
            ))}
          </div>

          <Card className="border-zinc-700 bg-zinc-800">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold">FAQ</h2>

              <div className="space-y-3">
                {result.faq?.map((item, index) => (
                  <div key={index} className="rounded-lg bg-zinc-700 px-4 py-3">
                    <p className="font-bold">Q. {item.question}</p>

                    <p className="mt-2 text-zinc-300">A. {item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
