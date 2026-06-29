"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CopyPublicUrlButton({ id }: { id: string }) {
  function handleCopy() {
    const url = `${window.location.origin}/lp/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("公開URLをコピーしました！");
  }

  return (
    <Button
      className="h-11 w-full"
      type="button"
      variant="outline"
      onClick={handleCopy}
    >
      URLコピー
    </Button>
  );
}
