"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
};

export default function SortableBenefit({
  id,
  value,
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
      className="mb-3 flex items-center gap-2"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab"
      >
        <GripVertical />
      </button>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />

      <Button type="button" variant="destructive" onClick={onDelete}>
        削除
      </Button>
    </div>
  );
}
