export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <div className="animate-pulse">
        {/* タイトル */}
        <div className="mb-2 h-4 w-24 rounded bg-slate-800" />
        <div className="mb-8 h-10 w-64 rounded bg-slate-800" />

        {/* 統計カード */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-28 rounded-xl bg-slate-900" />
          <div className="h-28 rounded-xl bg-slate-900" />
          <div className="h-28 rounded-xl bg-slate-900" />
        </div>

        {/* 一覧タイトル */}
        <div className="mb-6 h-8 w-48 rounded bg-slate-800" />

        {/* LPカード */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="mb-6 overflow-hidden rounded-2xl bg-slate-900"
          >
            <div className="h-56 bg-slate-800" />

            <div className="p-6">
              <div className="mb-4 h-8 w-2/3 rounded bg-slate-800" />
              <div className="mb-3 h-4 w-32 rounded bg-slate-800" />
              <div className="mb-3 h-4 w-24 rounded bg-slate-800" />
              <div className="mb-6 h-4 w-full rounded bg-slate-800" />

              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 rounded bg-slate-800" />
                <div className="h-10 rounded bg-slate-800" />
                <div className="h-10 rounded bg-slate-800" />
                <div className="h-10 rounded bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}