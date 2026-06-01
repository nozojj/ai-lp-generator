"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const ok = confirm(
      "削除しますか？"
    );

    if (!ok) return;

    await fetch(`/api/history/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="
        bg-red-500
        hover:bg-red-600
        px-4
        py-2
        rounded-lg
      "
    >
      削除
    </button>
  );
}