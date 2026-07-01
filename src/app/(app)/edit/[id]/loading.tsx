export default function Loading() {
  return (
    <main className="min-h-screen bg-background p-10 animate-pulse">
      <div className="mb-8 h-10 w-64 rounded bg-muted" />

      <div className="space-y-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-xl bg-slate-900"
          />
        ))}
      </div>
    </main>
  );
}