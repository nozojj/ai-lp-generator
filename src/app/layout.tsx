import type { Metadata } from "next";

import {
  ClerkProvider,
} from "@clerk/nextjs";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Link from "next/link";
import { Toaster } from "sonner";
import AuthButtons from "@/components/auth-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI LP Generator",
  description: "OpenAIを活用したAI LPジェネレーター",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body
          className={` ${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
        >
          <header className="flex items-center justify-between gap-4 border-b border-zinc-800 p-4">
            <Link href="/" className="text-xl font-bold">
              AI LP Generator
            </Link>
            <div className="flex items-center gap-6 text-zinc-400">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>

              <Link href="/history" className="transition hover:text-white">
                History
              </Link>

              <Link href="/pricing" className="transition hover:text-white">
                Pricing
              </Link>
            </div>
            <AuthButtons />
          </header>

          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
