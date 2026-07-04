import HeroCard from "@/components/HeroCard";
import { useParallax } from "@/hooks/useParallax";

export default function HeroSection() {
  const { mouseParallax, setTargetParallax } = useParallax();

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-16 text-center"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();

            setTargetParallax({
              x: (e.clientX - rect.left - rect.width / 2) / 40,
              y: (e.clientY - rect.top - rect.height / 2) / 40,
            });
          }}
          onMouseLeave={() =>
            setTargetParallax({
              x: 0,
              y: 0,
            })
          }
        >
          <div
            className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
            style={{
              transform: `translate(${mouseParallax.x * 2}px, ${mouseParallax.y * 2}px)`,
            }}
          >
            AIでLP・画像・HTMLを自動生成
          </div>

          <h1
            className="mb-4 bg-gradient-to-r from-cyan-200 to-blue-500 bg-clip-text text-6xl font-bold text-transparent"
            style={{
              transform: `translate(${mouseParallax.x * 2}px, ${mouseParallax.y * 2}px)`,
            }}
          >
            AI LP Generator
          </h1>

          <div className="mt-8 flex justify-center gap-10 text-center">
            <div
              style={{
                transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
              }}
            >
              <p className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                100+ Generated LPs
              </p>
              <p className="text-muted-foreground text-sm">生成LP</p>
            </div>

            <div
              style={{
                transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
              }}
            >
              <p className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                AI Powered
              </p>
              <p className="text-muted-foreground text-sm">Powered</p>
            </div>

            <div
              style={{
                transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
              }}
            >
              <p className="text-3xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                24/7 Available
              </p>
              <p className="text-muted-foreground text-sm">Available</p>
            </div>
          </div>
          <HeroCard mouseParallax={mouseParallax} />
        </div>

        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
          業種・ターゲット・雰囲気を入力するだけで、
          LP構成とヒーロー画像を数秒で生成します。
        </p>
      </div>
    </>
  );
}
