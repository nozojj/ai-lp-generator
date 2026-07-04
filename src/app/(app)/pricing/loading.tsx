export default function Loading() {
  return (
    <main className="min-h-screen p-10 animate-pulse">
      <div className="mb-2 h-4 w-24 rounded bg-muted" />

      <div className="mb-10 h-10 w-72 rounded bg-muted" />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="h-[500px] rounded-2xl bg-slate-900" />

        <div className="h-[500px] rounded-2xl bg-slate-900" />
      </div>
    </main>
  );
}