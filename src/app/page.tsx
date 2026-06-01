"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const [credits, setCredits] = useState<number | null>(null);

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

      setResult(data.result);

      setCredits((prev) => (prev !== null ? prev - 1 : prev));

      toast.success("生成成功");
    } catch (error) {
      console.log(error);

      toast.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="mb-10">
            <div className="flex justify-end mb-6">
              <Link
                href="/pricing"
                className="text-zinc-400 hover:text-white transition"
              >
                Pricing
              </Link>
            </div>
            <h1 className="text-5xl font-bold mb-3">AI LP Generator</h1>
            <p className="text-zinc-400 mt-2">
              残りクレジット:
              {credits}
            </p>
          </div>

          <p className="text-zinc-400">
            数秒でLP構成を生成。 OpenAIを活用したAI LPジェネレーター
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
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
                !business ||
                !target ||
                !atmosphere ||
                credits === 0
              }
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </div>
              ) : credits === 0 ? (
                "クレジット不足"
              ) : (
                "LPを生成"
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 mt-8">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Hero</h2>
                <p className="text-white leading-7 text-lg">{result.hero}</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">CTA</h2>
                <p className="text-white leading-7 text-lg">{result.cta}</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Benefits</h2>

                <div className="space-y-2">
                  {result.benefits?.map((item, index) => (
                    <div
                      key={index}
                      className="
                      bg-zinc-700
                      rounded-lg
                      px-4
                      py-3
                    "
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Features</h2>

                <ul className="list-disc pl-5 space-y-2">
                  {result.features.map((feature: string, index: number) => (
                    <li
                      key={index}
                      className="bg-zinc-700 text-white rounded-lg px-4 py-3"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">FAQ</h2>

                <div className="space-y-3">
                  {result.faq?.map((item, index) => (
                    <div
                      key={index}
                      className="
            bg-zinc-700
            rounded-lg
            px-4
            py-3
          "
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
