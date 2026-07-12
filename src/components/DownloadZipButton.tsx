"use client";

import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export default function DownloadZipButton({ id }: { id: string }) {
  return (
    <Button
      variant="outline"
      className="h-11 w-full px-5"
      onClick={() => {
        window.open(`/api/download-zip/${id}`);
      }}
    >
      <Package className="mr-2 h-4 w-4" />
      ZIPをダウンロード
    </Button>
  );
}
