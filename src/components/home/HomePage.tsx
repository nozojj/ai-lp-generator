"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import HeroBackground from "@/components/HeroBackground";
import LoadingDialog from "./LoadingDialog";
import HeroSection from "./HeroSection";
import GeneratorForm from "./GeneratorForm";
import PreviewSection from "./PreviewSection";
import HowItWorksSection from "./HowItWorksSection";
import { buildLivePreview } from "@/lib/live-preview";
import { status } from "@/constants/status";
import { useCredits } from "@/hooks/useCredits";
import { useGenerateLP } from "@/hooks/useGenerateLP";
import { useMouseGlow } from "@/hooks/useMouseGlow";
import { useWorkflow } from "@/hooks/useWorkflow";
import {
  benefitIcons,
  featureIcons,
  featureDescriptions,
} from "@/constants/features";

export default function Home() {
  const { isSignedIn } = useUser();

  const { credits } = useCredits();

  const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const { loading, activeStep, result, generate } = useGenerateLP(DEMO_MODE);

  const displayStep = useWorkflow();

  const { glowRef1, glowRef2, handleMouseMove } = useMouseGlow();

  const [business, setBusiness] = useState("");
  const [target, setTarget] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [template, setTemplate] = useState("modern");

  const [imageRotate, setImageRotate] = useState({
    x: 0,
    y: 0,
  });

  const displayResult =
    result ?? buildLivePreview(business, target, atmosphere);

  const heroWords = displayResult.hero.split("");

  return (
    <main
      className="bg-background text-foreground relative min-h-screen overflow-hidden p-6"
      onMouseMove={handleMouseMove}
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
        ref={glowRef1}
        className="pointer-events-none fixed h-96 w-96 rounded-full bg-blue-500/20 blur-3xl transition-all duration-150"
      />
      <div
        ref={glowRef2}
        className="pointer-events-none fixed h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <HeroSection />

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
        handleGenerate={() => generate(business, target, atmosphere, template)}
      />

      <PreviewSection
        displayResult={displayResult}
        heroWords={heroWords}
        business={business}
        target={target}
        template={template}
        isLive={!result}
        imageRotate={imageRotate}
        setImageRotate={setImageRotate}
        benefitIcons={benefitIcons}
        featureIcons={featureIcons}
        featureDescriptions={featureDescriptions}
      />
    </main>
  );
}
