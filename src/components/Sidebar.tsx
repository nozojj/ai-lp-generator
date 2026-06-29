import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Coins,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-10 text-2xl font-bold">
        AI LP
        <span className="text-emerald-400"> Generator</span>
      </h1>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-800"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-800"
        >
          <FileText size={20} />
          My LP
        </Link>

        <Link
          href="/credits"
          className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-800"
        >
          <Coins size={20} />
          Credits
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-800"
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}