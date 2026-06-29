"use client";

import { Button } from "@/components/ui/button";

export default function DownloadZipButton({ id }: { id: string }) {
  return (
    <Button
      className="h-11 w-full bg-orange-600 hover:bg-orange-500"
      onClick={() => {
        window.open(`/api/download-zip/${id}`);
      }}
    >
      ZIP
    </Button>
  );
}
