"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = {
  id: string;
  review: {
    name: string;
    comment: string;
  };
  onChange: (review: { name: string; comment: string }) => void;
  onDelete: () => void;
};

export default function SortableTestimonial({
  id,
  review,
  onChange,
  onDelete,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-6 rounded-xl border border-slate-700 p-4"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mb-3 cursor-grab"
      >
        <GripVertical />
      </button>

      <Label>名前</Label>

      <Input
        value={review.name}
        onChange={(e) =>
          onChange({
            ...review,
            name: e.target.value,
          })
        }
        className="mb-3"
      />

      <Label>コメント</Label>

      <Textarea
        value={review.comment}
        onChange={(e) =>
          onChange({
            ...review,
            comment: e.target.value,
          })
        }
      />

      <Button
        type="button"
        variant="destructive"
        className="mt-4"
        onClick={onDelete}
      >
        お客様の声を削除
      </Button>
    </div>
  );
}
