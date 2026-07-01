"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm("本当に削除しますか？");

    if (!ok) return;

    const res = await fetch(`/api/generation/${id}`, {
      method: "DELETE",
    });

    try {
      const res = await fetch(`/api/generation/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("削除しました");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("削除できませんでした");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          削除
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>

          <AlertDialogDescription>
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete}>削除する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
