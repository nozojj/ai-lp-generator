"use client";

import { Button } from "@/components/ui/button";

export default function DownloadHtmlButton({ id }: { id: string }) {
  const handleDownload = () => {
    window.open(`/api/download/${id}`, "_blank");
  };

  return (
    <Button
      onClick={handleDownload}
      className="w-full bg-indigo-600 hover:bg-indigo-500"
    >
      HTML
    </Button>
  );
}
