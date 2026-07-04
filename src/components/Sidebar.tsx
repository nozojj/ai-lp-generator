"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Layers,
  History as HistoryIcon,
  Coins,
  Settings,
  Tag,
} from "lucide-react";
import ThemeToggle from "./theme-toggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mylp", label: "My LP", icon: Layers },
  { href: "/history", label: "History", icon: HistoryIcon },
  { href: "/credits", label: "Credits", icon: Coins },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-card border-border flex w-64 shrink-0 flex-col border-r p-6">
      <h1 className="mb-10 text-2xl font-bold">
        AI LP
        <span className="text-emerald-400"> Generator</span>
      </h1>

      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "bg-accent text-accent-foreground flex items-center gap-3 rounded-lg border-l-4 border-emerald-400 p-3 pl-2 font-medium transition-colors"
                  : "hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg border-l-4 border-transparent p-3 pl-2 transition-colors"
              }
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
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
