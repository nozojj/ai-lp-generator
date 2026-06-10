"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthButtons from "@/components/auth-button";

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

  const handleGenerate = async () => {
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
      <div className="mx-auto max-w-4xl">
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
                0 → 100
              </p>
              <p className="text-sm text-zinc-500">生成LP</p>
            </div>

            <div
              style={{
                transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
              }}
            >
              <p className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                AI
              </p>
              <p className="text-sm text-zinc-500">Powered</p>
            </div>

            <div
              style={{
                transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
              }}
            >
              <p className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                24h
              </p>
              <p className="text-sm text-zinc-500">Available</p>
            </div>
          </div>

          <div className="my-12 flex justify-center">
            <div className="animate-[float_6s_ease-in-out_infinite]">
              <div
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl transition-all duration-500 hover:scale-105"
                style={{
                  transform: `
                  perspective(1000px)
                  rotateX(${-mouseParallax.y * 1.5}deg)
                  rotateY(${mouseParallax.x * 1.5}deg)
              `,
                }}
              >
                <div className="absolute top-6 left-1/2 z-20 w-[90%] max-w-4xl -translate-x-1/2">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/40 px-8 py-4 backdrop-blur-xl">
                    <div className="flex items-center gap-10">
                      <h2 className="text-xl font-bold">AI LP Generator</h2>

                      <div className="flex gap-6 text-sm text-zinc-300">
                        <Link href="/">Home</Link>
                        <Link href="/history">History</Link>
                        <Link href="/pricing">Pricing</Link>
                      </div>
                    </div>

                    <AuthButtons />
                  </div>
                </div>
              </div>
              <div
                style={{
                  transform: `translate(${mouseParallax.x * 1.5}px, ${mouseParallax.y * 1.5}px)`,
                }}
              >
                <Image
                  src="/hero-ai.jpg"
                  alt="AI LP Sample"
                  width={900}
                  height={500}
                  className="rounded-2xl transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10" />
              <div
                className="absolute bottom-8 left-8 rounded-xl border border-white/10 bg-black/30 p-6 backdrop-blur-md"
                style={{
                  transform: `
                  translate(
                    ${mouseParallax.x * 2}px,
                    ${mouseParallax.y * 2}px
                  )
                `,
                }}
              >
                <p className="mb-2 text-sm font-medium text-blue-300">
                  AI Powered
                </p>

                <h3 className="text-4xl font-bold text-white">
                  Landing Page Builder
                </h3>

                <p className="mt-2 max-w-md text-zinc-300">
                  AIがLP構成・コピー・画像を数秒で生成
                </p>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-zinc-400">
            業種・ターゲット・雰囲気を入力するだけで、
            LP構成とヒーロー画像を数秒で生成します。
          </p>

          <Card className="mx-auto mt-12 max-w-xl border-white/10 bg-white/5 shadow-[0_0_50px_rgba(59,130,246,0.15)] backdrop-blur-xl">
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
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                disabled={
                  !isSignedIn ||
                  loading ||
                  credits === null ||
                  !business ||
                  !target ||
                  !atmosphere ||
                  credits === 0
                }
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AIでLPと画像を生成中...
                  </div>
                ) : !isSignedIn ? (
                  "ログインしてください"
                ) : credits === null ? (
                  "確認中..."
                ) : credits === 0 ? (
                  "クレジット不足"
                ) : (
                  "LPを生成"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-24">
          <h2 className="mb-12 text-center text-3xl font-bold">
            たった3ステップで生成
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="h-56 border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 text-6xl font-bold text-cyan-400">①</div>

                <h3 className="mb-2 text-xl font-bold">情報入力</h3>

                <p className="text-zinc-400">業種・ターゲット・雰囲気を入力</p>
              </CardContent>
            </Card>

            <Card className="h-56 border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 text-6xl font-bold text-cyan-400">②</div>

                <h3 className="mb-2 text-xl font-bold">AI生成</h3>

                <p className="text-zinc-400">LP構成と画像を自動生成</p>
              </CardContent>
            </Card>

            <Card className="h-56 border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 text-6xl font-bold text-cyan-400">③</div>

                <h3 className="mb-2 text-xl font-bold">保存・活用</h3>

                <p className="text-zinc-400">生成履歴からいつでも利用可能</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center text-zinc-400">
          {isPro ? (
            <>
              <p>✨ Proプラン利用中（無制限生成）</p>
              <p>保有クレジット: {credits}</p>
            </>
          ) : credits === null ? (
            "クレジット確認中..."
          ) : (
            `残りクレジット: ${credits}`
          )}
        </div>

        <p className="text-zinc-400">
          数秒でLP構成を生成。OpenAIを活用したAI LPジェネレーター
        </p>
      </div>

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
      <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
          <CardContent className="p-6 text-center">
            <div className="mb-3 text-4xl drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white">LP構成生成</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              AIがLP構成を自動作成
            </p>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
          <CardContent className="p-6 text-center">
            <div className="mb-3 text-4xl drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
              🎨
            </div>
            <h3 className="text-lg font-bold text-white">AI画像生成</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              ヒーロー画像を自動生成
            </p>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
          <CardContent className="p-6 text-center">
            <div className="mb-3 text-4xl drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
              💳
            </div>
            <h3 className="text-lg font-bold text-white">Stripe決済</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              サブスク課金対応
            </p>
          </CardContent>
        </Card>

        <Card className="group border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
          <CardContent className="p-6 text-center">
            <div className="mb-3 text-4xl drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
              📜
            </div>
            <h3 className="text-lg font-bold text-white">HTML出力</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              コードとして保存可能
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
