"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import HeroBackground from "@/components/HeroBackground";
import LoadingDialog from "./LoadingDialog";
import HeroSection from "./HeroSection";
import GeneratorForm from "./GeneratorForm";
import PreviewSection from "./PreviewSection";
import HowItWorksSection from "./HowItWorksSection";
import { previewResult } from "@/constants/preview-result";
import { status } from "@/constants/status";
import { useCredits } from "@/hooks/useCredits";
import { useGenerateLP } from "@/hooks/useGenerateLP";
import { useParallax } from "@/hooks/useParallax";
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

  const { mouseLight, setMouseLight, mouseParallax, setTargetParallax } =
    useParallax();

  const [business, setBusiness] = useState("");
  const [target, setTarget] = useState("");
  const [atmosphere, setAtmosphere] = useState("");
  const [template, setTemplate] = useState("modern");

  const [imageRotate, setImageRotate] = useState({
    x: 0,
    y: 0,
  });

  const displayResult = result ?? previewResult;

  const heroWords = displayResult.hero.split("");

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
        handleGenerate={() => generate(business, target, atmosphere, template)}
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
