"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ResultType = {
  hero: string;
  cta: string;
  features: string[];
};
export default function Home() {
  const [business, setBusiness] = useState("");
  const [target, setTarget] = useState("");
  const [atmosphere, setAtmosphere] = useState("");

  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);

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
        throw new Error("API Error");
      }

      const data = await response.json();

      try {
        const parsed = JSON.parse(data.result);
        setResult(parsed);
      } catch {
        console.log("JSON parse error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">AI LP Generator</h1>

          <p className="text-zinc-400">
            数秒でLP構成を生成。 OpenAIを活用したAI LPジェネレーター
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="space-y-4 p-6">
            <Input
              placeholder="業種（例：パーソナルジム）"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />

            <Input
              placeholder="ターゲット（例：20代女性）"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />

            <Input
              placeholder="雰囲気（例：高級感）"
              value={atmosphere}
              onChange={(e) => setAtmosphere(e.target.value)}
            />

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={loading || !business || !target || !atmosphere}
            >
              {loading ? "Generating..." : "Generate LP"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 mt-8">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Hero</h2>
                <p className="text-zinc-300 leading-7">{result.hero}</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">CTA</h2>
                <p className="text-zinc-300 leading-7">{result.cta}</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Features</h2>

                <ul className="list-disc pl-5 space-y-2">
                  {result.features.map((feature: string, index: number) => (
                    <li
                      key={index}
                      className="bg-zinc-800 rounded-lg px-4 py-3"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
