export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 p-10 animate-pulse">
      <div className="mb-8 h-96 rounded-2xl bg-slate-900" />

      <div className="mb-6 h-12 w-96 rounded bg-slate-800" />

      <div className="space-y-3">
        <div className="h-6 rounded bg-slate-800" />

        <div className="h-6 rounded bg-slate-800" />

        <div className="h-6 w-2/3 rounded bg-slate-800" />
      </div>
    </main>
  );
}