"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function FavoriteButton({
  id,
  isFavorite: initialIsFavorite,
}: {
  id: string;
  isFavorite: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isSaving, setIsSaving] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;

    const next = !isFavorite;
    setIsFavorite(next);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/generation/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: next }),
      });

      if (!res.ok) {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      setIsFavorite(!next);
      toast.error("お気に入りの更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "お気に入りから外す" : "お気に入りに追加"}
      title={isFavorite ? "お気に入りから外す" : "お気に入りに追加"}
      className="bg-background/80 hover:bg-background absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
    >
      <Star
        className={cn(
          "h-5 w-5 transition-colors",
          isFavorite
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground",
        )}
      />
    </button>
  );
}
