"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PublishToggleButton({
  id,
  isPublished: initialIsPublished,
  createdAt,
  updatedAt,
}: {
  id: string;
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing =
    !isPublished && new Date(updatedAt).getTime() > new Date(createdAt).getTime();

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;

    const next = !isPublished;
    setIsPublished(next);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/generation/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: next }),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(next ? "公開しました" : "非公開にしました");
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsPublished(!next);
      toast.error("公開状態の更新に失敗しました");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isPublished}
      aria-label={isPublished ? "非公開にする" : "公開する"}
      title={isPublished ? "非公開にする" : "公開する"}
      className={cn(
        "absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm transition-all",
        isPublished &&
          "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/40 ring-1 ring-emerald-300/50 hover:shadow-emerald-500/60",
        !isPublished &&
          isEditing &&
          "bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-md shadow-amber-500/40 ring-1 ring-amber-300/50 hover:shadow-amber-500/60",
        !isPublished &&
          !isEditing &&
          "bg-background/80 text-muted-foreground hover:bg-background",
      )}
    >
      {isPublished && <Eye className="h-4 w-4" />}
      {!isPublished && isEditing && <Pencil className="h-4 w-4" />}
      {!isPublished && !isEditing && <EyeOff className="h-4 w-4" />}
      {isPublished ? "公開済み" : isEditing ? "編集中" : "下書き"}
    </button>
  );
}
