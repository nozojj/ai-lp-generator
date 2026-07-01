import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
      <h1 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-8xl font-black text-transparent">
        404
      </h1>

      <p className="mb-4 text-5xl font-bold">ページが見つかりません</p>

      <p className="mb-8 max-w-md text-center leading-7 text-muted-foreground">
        お探しのページは存在しないか、 URLが間違っている可能性があります。
      </p>

      <Link href="/">
        <Button
          size="lg"
          className="bg-blue-600 transition hover:scale-105 hover:bg-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ホームへ戻る
        </Button>
      </Link>
    </main>
  );
}
