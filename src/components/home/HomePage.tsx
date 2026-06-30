"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import HeroBackground from "@/components/HeroBackground";
import LoadingDialog from "./LoadingDialog";
import HeroSection from "./HeroSection";
import GeneratorForm from "./GeneratorForm";
import PreviewSection from "./PreviewSection";
import type { Result } from "@/types/result";
import HowItWorksSection from "./HowItWorksSection";
import { previewResult } from "@/constants/preview-result";
import { status } from "@/constants/status";
import { useCredits } from "@/hooks/useCredits";
import { useGenerateLP } from "@/hooks/useGenerateLP";
import {
  benefitIcons,
  featureIcons,
  featureDescriptions,
} from "@/constants/features";

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

  const [displayStep, setDisplayStep] = useState(0);
  const { isSignedIn } = useUser();

  const [business, setBusiness] = useState("");
  const [target, setTarget] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [template, setTemplate] = useState("modern");

  const [imageRotate, setImageRotate] = useState({
    x: 0,
    y: 0,
  });
  const { credits } = useCredits();
  //結果の代用
  const displayResult = result ?? previewResult;
  //デモ
  const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const {
  loading,
  activeStep,
  result,
  generate,
  setActiveStep,
} = useGenerateLP(DEMO_MODE);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? prev : prev + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, setActiveStep]);

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
      console.log(error);

      toast.error("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

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
      <LoadingDialog
        loading={loading}
        activeStep={activeStep}
        status={status}
        demoMode={DEMO_MODE}
      />
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

      <HeroSection
        mouseParallax={mouseParallax}
        setTargetParallax={setTargetParallax}
      />

      <HowItWorksSection displayStep={displayStep} status={status} />

      <GeneratorForm
        loading={loading}
        credits={credits}
        isSignedIn={!!isSignedIn}
        business={business}
        setBusiness={setBusiness}
        target={target}
        setTarget={setTarget}
        atmosphere={atmosphere}
        setAtmosphere={setAtmosphere}
        template={template}
        setTemplate={setTemplate}
        activeStep={activeStep}
        status={status}
        handleGenerate={handleGenerate}
      />

      <PreviewSection
        displayResult={displayResult}
        heroWords={heroWords}
        business={business}
        target={target}
        imageRotate={imageRotate}
        setImageRotate={setImageRotate}
        benefitIcons={benefitIcons}
        featureIcons={featureIcons}
        featureDescriptions={featureDescriptions}
      />
    </main>
  );
}
