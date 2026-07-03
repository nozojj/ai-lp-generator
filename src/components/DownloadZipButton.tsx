"use client";

import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export default function DownloadZipButton({ id }: { id: string }) {
  return (
    <Button
      className="h-11 w-full bg-orange-600 hover:bg-orange-500"
      onClick={() => {
        window.open(`/api/download-zip/${id}`);
      }}
    >
      <Package className="mr-2 h-4 w-4" />
      ZIPをダウンロード
    </Button>
  );
}
