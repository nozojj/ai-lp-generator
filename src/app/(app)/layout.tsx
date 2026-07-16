import Sidebar from "@/components/Sidebar";
import HeroBackground from "@/components/HeroBackground";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -inset-x-16 translate-x-16 blur-md brightness-[0.5]">
        <HeroBackground />
      </div>

      <div className="relative z-10 flex w-full flex-col md:flex-row">
        <Sidebar />

        <main className="relative flex-1">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
