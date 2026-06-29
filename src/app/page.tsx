import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "AI LP Generator",
  description: "AIが数秒で高品質なランディングページを生成するAI SaaS。",
};

export default function Page() {
  return <HomePage />;
}