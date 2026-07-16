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
  Menu,
} from "lucide-react";
import ThemeToggle from "./theme-toggle";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mylp", label: "My LP", icon: Layers },
  { href: "/history", label: "History", icon: HistoryIcon },
  { href: "/credits", label: "Credits", icon: Coins },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: (typeof navItems)[number] & { isActive: boolean }) {
  return (
    <Link
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
}

export default function Sidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <header className="bg-card border-border sticky top-0 z-20 flex items-center justify-between border-b p-4 md:hidden">
        <h1 className="text-lg font-bold">
          AI LP
          <span className="text-emerald-400"> Generator</span>
        </h1>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="メニューを開く"
              className="hover:bg-accent rounded-lg p-2 transition-colors"
            >
              <Menu size={22} />
            </button>
          </PopoverTrigger>

          <PopoverContent align="end" sideOffset={12} className="w-64">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <PopoverClose key={item.href} asChild>
                  <NavLink {...item} isActive={isItemActive(item.href)} />
                </PopoverClose>
              ))}
            </nav>

            <div className="border-border mt-2 flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground text-sm">テーマ</span>

              <ThemeToggle />
            </div>
          </PopoverContent>
        </Popover>
      </header>

      {/* Desktop sidebar */}
      <aside className="bg-card border-border hidden w-64 shrink-0 flex-col border-r p-6 md:flex">
        <h1 className="mb-10 text-2xl font-bold">
          AI LP
          <span className="text-emerald-400"> Generator</span>
        </h1>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} isActive={isItemActive(item.href)} />
          ))}
        </nav>

        <div className="border-border mt-auto border-t pt-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">テーマ</span>

            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
