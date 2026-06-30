"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type { Result } from "@/types/result";
import { previewResult } from "@/constants/preview-result";

export function useGenerateLP(demoMode: boolean) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const generate = async (
    business: string,
    target: string,
    atmosphere: string,
    template: string,
  ) => {
    if (demoMode) {
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
          template,
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
      console.error(error);
      toast.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    activeStep,
    result,
    generate,
    setActiveStep,
  };
}