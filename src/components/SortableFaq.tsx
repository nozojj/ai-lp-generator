"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

type Props = {
  id: string;
  value: {
    question: string;
    answer: string;
  };
  onChange: (value: { question: string; answer: string }) => void;
  onDelete: () => void;
};

export default function SortableFaq({
  id,
  value,
  onChange,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

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

      <Input
        value={value.question}
        onChange={(e) =>
          onChange({
            ...value,
            question: e.target.value,
          })
        }
        placeholder="質問"
        className="mb-3"
      />

      <Textarea
        value={value.answer}
        onChange={(e) =>
          onChange({
            ...value,
            answer: e.target.value,
          })
        }
        placeholder="回答"
      />

      <Button
        type="button"
        variant="destructive"
        className="mt-4"
        onClick={onDelete}
      >
        FAQを削除
      </Button>
    </div>
  );
}