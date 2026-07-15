"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type { Result } from "@/types/result";

export function useGenerateLP() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? prev : prev + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  const generate = async (
    business: string,
    target: string,
    atmosphere: string,
    template: string,
  ) => {
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
          template,
        }),
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            toast.error("入力内容を確認してください");
            break;

          case 401:
            toast.error("ログインしてください");
            break;

          case 402:
            toast.error("クレジットが不足しています");
            break;

          case 403:
            toast.error("現在は管理者のみ利用できます");
            break;

          case 500:
            toast.error("AI生成に失敗しました");
            break;

          default:
            toast.error("予期しないエラーが発生しました");
        }

        throw new Error("API Error");
      }

      const data = await response.json();

      toast.success("生成成功");

      router.push(`/history/${data.id}`);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    activeStep,
    result,
    generate,
  };
}
