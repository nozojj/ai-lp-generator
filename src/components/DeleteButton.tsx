"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm("本当に削除しますか？");

    if (!ok) return;

    const res = await fetch(`/api/delete/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("削除しました");
      router.refresh();
    } else {
      toast.error("削除に失敗しました");
    }
  }

  return (
    <Button variant="destructive" className="w-full" onClick={handleDelete}>
      削除
    </Button>
  );
}
