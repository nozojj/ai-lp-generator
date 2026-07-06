"use client";

import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
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
      <Link2 className="mr-2 h-4 w-4" />
      URLコピー
    </Button>
  );
}
