import Link from "next/link";
import {
  Home,
  LayoutDashboard,
  Layers,
  History as HistoryIcon,
  Coins,
  Settings,
} from "lucide-react";
import ThemeToggle from "./theme-toggle";

export default function Sidebar() {
  return (
    <aside className="bg-card border-border flex w-64 shrink-0 flex-col border-r p-6">
      <h1 className="mb-10 text-2xl font-bold">
        AI LP
        <span className="text-emerald-400"> Generator</span>
      </h1>

      <nav className="space-y-2">
        <Link
          href="/"
          className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg p-3 transition-colors"
        >
          <Home size={20} />
          Home
        </Link>

        <Link
          href="/dashboard"
          className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg p-3 transition-colors"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          href="/mylp"
          className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg p-3 transition-colors"
        >
          <Layers size={20} />
          My LP
        </Link>

        <Link
          href="/history"
          className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg p-3 transition-colors"
        >
          <HistoryIcon size={20} />
          History
        </Link>

        <Link
          href="/credits"
          className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg p-3 transition-colors"
        >
          <Coins size={20} />
          Credits
        </Link>

        <Link
          href="/settings"
          className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg p-3 transition-colors"
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>
      <div className="border-border mt-auto border-t pt-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">テーマ</span>

          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
