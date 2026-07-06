export default function Loading() {
  return (
    <main className="min-h-screen p-10 animate-pulse">
      <div className="mb-10 h-10 w-72 rounded bg-muted" />

      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-slate-900"
          />
        ))}
      </div>
    </main>
  );
}