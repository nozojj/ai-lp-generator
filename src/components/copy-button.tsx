"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyButton({
  text,
}: {
  text: string;
}) {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success("コピーしました");
      }}
    >
      コピー
    </Button>
  );
}