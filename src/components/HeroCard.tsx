import Link from "next/link";
import AuthButtons from "./auth-button";
import HeroBackground from "./HeroBackground";

type Props = {
  mouseParallax: {
    x: number;
    y: number;
  };
};

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
          <div className="absolute top-6 left-1/2 z-20 w-[90%] max-w-4xl -translate-x-1/2">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/40 px-8 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-10">
                <h2 className="text-xl font-bold">AI LP Generator</h2>

                <div className="flex gap-6 text-sm text-zinc-300">
                  <Link href="/">Home</Link>
                  <Link href="/history">History</Link>
                  <Link href="/pricing">Pricing</Link>
                </div>
              </div>

              <AuthButtons />
            </div>
          </div>
          <div className="relative h-[560px]">
            <div className="absolute inset-0">
              <HeroBackground />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10" />
            <div
              className="absolute top-[58%] left-16 rounded-xl border border-white/10 bg-black/30 p-6 backdrop-blur-md"
              style={{
                transform: `
                  translate(
                    ${mouseParallax.x * 2}px,
                    ${mouseParallax.y * 2}px
                  )
                `,
              }}
            >
              <div className="mb-4 flex gap-2">
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

              <h3 className="text-4xl font-bold text-white">
                Landing Page Builder
              </h3>

              <p className="mt-2 max-w-md text-zinc-300">
                AIがLP構成・コピー・画像を数秒で生成
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
