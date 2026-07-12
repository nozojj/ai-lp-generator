import Link from "next/link";
import { Menu } from "lucide-react";
import AuthButtons from "./auth-button";
import HeroBackground from "./HeroBackground";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

type Props = {
  mouseParallax: {
    x: number;
    y: number;
  };
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/pricing", label: "Pricing" },
];

export default function HeroCard({ mouseParallax }: Props) {
  return (
    <div className="my-12 flex w-full justify-center">
      <div className="w-full max-w-6xl animate-[float_6s_ease-in-out_infinite]">
        <div
          className="group relative overflow-hidden rounded-2xl border border-cyan-500/10 bg-zinc-950/20 shadow-[0_0_60px_rgba(34,211,238,.08)] backdrop-blur-xl transition-all duration-500 hover:scale-[1.01]"
          style={{
            transform: `
                  perspective(1000px)
                  rotateX(${-mouseParallax.y * 1.5}deg)
                  rotateY(${mouseParallax.x * 1.5}deg)
              `,
          }}
        >
          <div className="absolute top-4 left-1/2 z-20 w-[92%] max-w-4xl -translate-x-1/2 sm:top-6">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/40 px-4 py-3 backdrop-blur-xl md:px-8 md:py-4">
              <div className="flex items-center gap-4 md:gap-10">
                <h2 className="text-sm font-bold whitespace-nowrap sm:text-xl">
                  AI LP Generator
                </h2>

                <div className="hidden gap-6 text-sm text-zinc-300 md:flex">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hidden md:block">
                <AuthButtons />
              </div>

              <Drawer direction="right">
                <DrawerTrigger asChild>
                  <button
                    type="button"
                    aria-label="メニューを開く"
                    className="rounded-lg p-2 text-zinc-300 hover:text-white md:hidden"
                  >
                    <Menu size={22} />
                  </button>
                </DrawerTrigger>

                <DrawerContent className="border-white/10 bg-zinc-950/95 text-zinc-100 backdrop-blur-xl">
                  <DrawerHeader>
                    <DrawerTitle className="text-zinc-100">
                      AI LP Generator
                    </DrawerTitle>
                  </DrawerHeader>

                  <nav className="flex flex-col gap-1 px-4">
                    {navLinks.map((link) => (
                      <DrawerClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="rounded-lg px-3 py-3 text-base text-zinc-200 hover:bg-white/5 hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </DrawerClose>
                    ))}
                  </nav>

                  <DrawerFooter>
                    <AuthButtons />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <div className="relative h-105 sm:h-120 md:h-140">
            <div className="absolute inset-0">
              <HeroBackground />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10" />
            <div
              className="absolute top-[54%] left-4 w-[calc(100%-2rem)] rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur-md sm:top-[58%] sm:left-16 sm:w-auto sm:p-6"
              style={{
                transform: `
                  translate(
                    ${mouseParallax.x * 2}px,
                    ${mouseParallax.y * 2}px
                  )
                `,
              }}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                  AI
                </span>

                <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
                  HTML
                </span>

                <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs text-violet-300">
                  Image
                </span>
              </div>
              <p className="mb-2 text-sm font-medium text-blue-300">
                AI Powered
              </p>

              <h3 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                Landing Page Builder
              </h3>

              <p className="mt-2 max-w-md text-sm text-zinc-300 sm:text-base">
                AIがLP構成・コピー・画像を数秒で生成
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
