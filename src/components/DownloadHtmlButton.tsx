"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

export default function DownloadHtmlButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    window.location.href = `/api/download/${id}`;

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="h-11 w-full bg-indigo-600 hover:bg-indigo-500"
    >
      {loading ? (
        "ダウンロード中..."
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          📦 Download LP ZIP
        </>
      )}
    </Button>
  );
}
