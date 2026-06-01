import type { Metadata } from "next";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "sonner";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body
          className={`
            ${geistSans.variable}
            ${geistMono.variable}
            antialiased
            bg-black
            text-white
          `}
        >
          <header
            className="
              flex
              justify-between
              items-center
              p-4
              gap-4
              border-b
              border-zinc-800
            "
          >
            <Link href="/" className="text-xl font-bold">
              AI LP Generator
            </Link>
            <div className="flex items-center gap-6 text-zinc-400">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>

              <Link href="/history" className="hover:text-white transition">
                History
              </Link>

              <Link href="/pricing" className="hover:text-white transition">
                Pricing
              </Link>
            </div>
            <SignInButton>
              <Button className="border-white cursor-pointer">ログイン</Button>
            </SignInButton>

            <SignUpButton>
              <Button
                className="border-white
               cursor-pointer"
              >
                新規登録
              </Button>
            </SignUpButton>

            <UserButton />
          </header>

          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
