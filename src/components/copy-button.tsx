"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({
  text,
}: {
  text: string;
}) {
  return (
    <Button
      className="h-11 w-full"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success("コピーしました");
      }}
    >
      <Copy className="mr-2 h-4 w-4" />
      コピー
    </Button>
  );
}