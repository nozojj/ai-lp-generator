import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

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
          {/* <header className="sticky top-4 z-50 mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/60 px-8 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-10">
              <Link
                href="/"
                className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-xl font-bold text-transparent"
              >
                AI LP Generator
              </Link>

              <div className="flex items-center gap-6 text-sm text-zinc-400">
                <Link href="/">Home</Link>
                <Link href="/history">History</Link>
                <Link href="/pricing">Pricing</Link>
              </div>
            </div>

            <AuthButtons />
          </header> */}

          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
