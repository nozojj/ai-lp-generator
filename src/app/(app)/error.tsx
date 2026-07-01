"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="text-foreground flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6">
      <h1 className="text-7xl font-black text-red-500">Oops...</h1>

      <h2 className="mt-6 text-3xl font-bold">エラーが発生しました</h2>

      <p className="text-muted-foreground mt-3 max-w-md text-center">
        もう一度お試しください。
      </p>

      <Button onClick={() => reset()} className="mt-8">
        再読み込み
      </Button>
    </main>
  );
}
