export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-background p-10 text-foreground">
      <div className="mb-2 h-4 w-24 rounded bg-muted" />

      <div className="mb-8 h-10 w-72 rounded bg-muted" />

      <div className="mb-8 h-36 rounded-2xl bg-slate-900" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-900" />
        ))}
      </div>
    </main>
  );
}
