export type TemplateTheme = {
  heroGradient: string;
  ctaGradient: string;
  glow: string;
};

const THEMES: Record<string, TemplateTheme> = {
  luxury: {
    heroGradient: "from-white via-amber-200 to-amber-400",
    ctaGradient: "from-amber-500 to-yellow-600",
    glow: "rgba(251,191,36,.45)",
  },
  minimal: {
    heroGradient: "from-white via-zinc-300 to-zinc-100",
    ctaGradient: "from-zinc-500 to-zinc-700",
    glow: "rgba(212,212,216,.35)",
  },
  corporate: {
    heroGradient: "from-white via-slate-300 to-blue-300",
    ctaGradient: "from-slate-600 to-blue-700",
    glow: "rgba(100,116,139,.45)",
  },
  modern: {
    heroGradient: "from-white via-cyan-200 to-cyan-400",
    ctaGradient: "from-cyan-500 to-blue-600",
    glow: "rgba(34,211,238,.45)",
  },
};

export function getTemplateTheme(template: string): TemplateTheme {
  return THEMES[template] ?? THEMES.modern;
}
