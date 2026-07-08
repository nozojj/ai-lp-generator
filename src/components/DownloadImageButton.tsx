"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageDown } from "lucide-react";
import { toast } from "sonner";

export default function DownloadImageButton({
  imageUrl,
  fileName,
}: {
  imageUrl: string;
  fileName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);

    try {
      const res = await fetch(imageUrl);

      if (!res.ok) {
        throw new Error();
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("画像のダウンロードに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDownload}
      disabled={loading}
      className="h-11 w-full px-5"
    >
      <ImageDown className="mr-2 h-4 w-4" />
      {loading ? "ダウンロード中..." : "画像をダウンロード"}
    </Button>
  );
}
