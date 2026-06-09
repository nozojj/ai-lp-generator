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
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <h1 className="mb-3 text-5xl font-bold">AI LP Generator</h1>
          <div className="mb-6 flex justify-end">
            <Link
              href="/pricing"
              className="text-zinc-400 transition hover:text-white"
            >
              Pricing
            </Link>
          </div>

          <div className="mt-2 text-zinc-400">
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

        <Card className="border-zinc-800 bg-zinc-900">
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
              className="w-full"
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
                    <div
                      key={index}
                      className="rounded-lg bg-zinc-700 px-4 py-3"
                    >
                      <p className="font-bold">Q. {item.question}</p>

                      <p className="mt-2 text-zinc-300">A. {item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
