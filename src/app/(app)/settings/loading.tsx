export default function SettingsLoading() {
  return (
    <main className="text-foreground min-h-screen p-8">
      <div className="mb-8 space-y-3">
        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
        <div className="bg-muted h-10 w-32 animate-pulse rounded" />
        <div className="bg-muted h-5 w-72 animate-pulse rounded" />
      </div>

      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-xl border p-6"
          >
            <div className="bg-muted mb-6 h-6 w-32 animate-pulse rounded" />

            <div className="space-y-4">
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
              <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
