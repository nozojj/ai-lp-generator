"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Redo2, Undo2 } from "lucide-react";
import Image from "next/image";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { useHistoryState } from "@/hooks/useHistoryState";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableFeature from "./SortableFeature";
import SortableTestimonial from "./SortableTestimonial";
import SortableBenefit from "./SortableBenefit";
import SortableFaq from "./SortableFaq";
import Template, { type TemplateData } from "./templates/Template";
import { cn } from "@/lib/utils";

type EditableContent = {
  hero: string;
  cta: string;
  features: string[];
  benefits: string[];
  faq: { question: string; answer: string }[];
  testimonials: { name: string; comment: string }[];
};

export default function EditForm({
  id,
  hero: initialHero,
  cta: initialCta,
  ctaUrl,
  template,
  imageUrl: initialImageUrl,
  features: initialFeatures,
  benefits: initialBenefits,
  faq: initialFaq,
  testimonials: initialTestimonials,
}: {
  id: string;
  hero: string;
  cta: string;
  ctaUrl: string | null;
  template: string;
  imageUrl: string | null;
  features: string[];
  benefits: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  testimonials: {
    name: string;
    comment: string;
  }[];
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  const {
    state: content,
    set: setContent,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistoryState<EditableContent>({
    hero: initialHero,
    cta: initialCta,
    features: initialFeatures,
    benefits: initialBenefits,
    faq: initialFaq,
    testimonials: initialTestimonials?.length
      ? initialTestimonials
      : [
          { name: "", comment: "" },
          { name: "", comment: "" },
          { name: "", comment: "" },
        ],
  });

  const { hero, cta, features, benefits, faq, testimonials } = content;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;

      if (e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      } else if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/lp/${id}` : "";
  const preview = useMemo(() => {
    if (!image) return initialImageUrl;
    return URL.createObjectURL(image);
  }, [image, initialImageUrl]);

  const previewItem: TemplateData = useMemo(
    () => ({
      hero,
      cta,
      ctaUrl,
      template,
      features,
      benefits,
      faq,
      testimonials,
      imageUrl: preview,
    }),
    [hero, cta, ctaUrl, template, features, benefits, faq, testimonials, preview],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = features.findIndex((_, i) => i.toString() === active.id);
    const newIndex = features.findIndex((_, i) => i.toString() === over.id);

    setContent(
      (prev) => ({
        ...prev,
        features: arrayMove(prev.features, oldIndex, newIndex),
      }),
      true,
    );
  }

  function handleDragEndBenefit(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = benefits.findIndex((_, i) => i.toString() === active.id);
    const newIndex = benefits.findIndex((_, i) => i.toString() === over.id);

    setContent(
      (prev) => ({
        ...prev,
        benefits: arrayMove(prev.benefits, oldIndex, newIndex),
      }),
      true,
    );
  }

  function handleDragEndFaq(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = faq.findIndex((_, i) => i.toString() === active.id);
    const newIndex = faq.findIndex((_, i) => i.toString() === over.id);

    setContent(
      (prev) => ({ ...prev, faq: arrayMove(prev.faq, oldIndex, newIndex) }),
      true,
    );
  }

  function handleDragEndTestimonial(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex(
      (_, i) => i.toString() === active.id,
    );

    const newIndex = testimonials.findIndex((_, i) => i.toString() === over.id);

    setContent(
      (prev) => ({
        ...prev,
        testimonials: arrayMove(prev.testimonials, oldIndex, newIndex),
      }),
      true,
    );
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      let imageUrl: string | undefined;

      if (image) {
        if (process.env.NODE_ENV === "development") {
          console.log("画像アップロード開始");
        }

        const fileName = `${Date.now()}-${image.name}`;

        const { error } = await supabase.storage
          .from("lp-images")
          .upload(`public/${fileName}`, image);

        if (error) {
          console.log(error);
          toast.error(error.message);
          return;
        }

        const { data } = supabase.storage
          .from("lp-images")
          .getPublicUrl(`public/${fileName}`);

        imageUrl = data.publicUrl;
      }

      const res = await fetch(`/api/edit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hero,
          cta,
          features,
          benefits,
          faq,
          testimonials,
          imageUrl,
        }),
      });

      if (res.ok) {
        toast.success("保存しました！");
        router.refresh();
      } else {
        toast.error("保存に失敗しました");
      }
    } catch (error) {
      console.error(error);
      toast.error("通信エラーが発生しました");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImprove() {
    if (!aiPrompt.trim()) {
      toast.error("改善内容を入力してください");
      return;
    }

    setIsImproving(true);

    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hero,
          cta,
          features,
          benefits,
          faq,
          testimonials,
          prompt: aiPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "改善に失敗しました");
        return;
      }

      setContent(
        {
          hero: data.hero,
          cta: data.cta,
          features: data.features,
          benefits: data.benefits,
          faq: data.faq,
          testimonials: data.testimonials,
        },
        true,
      );

      toast.success("AIが改善しました！");
    } catch (error) {
      console.error(error);
      toast.error("通信エラー");
    } finally {
      setIsImproving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="flex gap-1 rounded-lg border border-slate-700 p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView("edit")}
          className={cn(
            "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
            mobileView === "edit"
              ? "bg-muted text-foreground"
              : "text-muted-foreground",
          )}
        >
          編集
        </button>

        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={cn(
            "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
            mobileView === "preview"
              ? "bg-muted text-foreground"
              : "text-muted-foreground",
          )}
        >
          プレビュー
        </button>
      </div>

      <div
        className={cn(
          "space-y-6",
          mobileView === "preview" && "hidden lg:block",
        )}
      >
        <div>
          <Label className="mb-2 block font-bold">Hero</Label>
        <Input
          value={hero}
          onChange={(e) =>
            setContent((prev) => ({ ...prev, hero: e.target.value }))
          }
          className="w-full rounded-lg border border-slate-700 bg-muted p-3"
        />
      </div>

      <div>
        <Label className="mb-2 block font-bold">CTA</Label>
        <Textarea
          value={cta}
          onChange={(e) =>
            setContent((prev) => ({ ...prev, cta: e.target.value }))
          }
          rows={4}
          className="w-full rounded-lg border border-slate-700 bg-muted p-3"
        />
      </div>

      <div className="rounded-xl border border-slate-700 p-6">
        <Label className="mb-2 block font-bold">AIで内容を改善</Label>

        <Textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="例：もっと高級感のある文章にしてください"
        />

        <Button className="mt-4" onClick={handleImprove} disabled={isImproving}>
          {isImproving ? "改善中..." : "✨ AIで改善"}
        </Button>
      </div>

      <div>
        <Label className="mb-2 block font-bold">Hero画像</Label>

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />

        {preview && (
          <div className="relative mt-4 h-64 w-full">
            <Image
              src={preview}
              alt="Preview"
              fill
              unoptimized
              className="rounded-xl border border-slate-700 object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <Label className="mb-2 block font-bold">Features</Label>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={features.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            {features.map((feature, index) => (
              <SortableFeature
                key={index}
                id={index.toString()}
                value={feature}
                onChange={(value) => {
                  setContent((prev) => {
                    const newFeatures = [...prev.features];
                    newFeatures[index] = value;
                    return { ...prev, features: newFeatures };
                  });
                }}
                onDelete={() => {
                  setContent(
                    (prev) => ({
                      ...prev,
                      features: prev.features.filter((_, i) => i !== index),
                    }),
                    true,
                  );
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setContent(
              (prev) => ({ ...prev, features: [...prev.features, ""] }),
              true,
            );
          }}
        >
          + Featureを追加
        </Button>
      </div>

      <div>
        <Label className="mb-2 block font-bold">Benefits</Label>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndBenefit}
        >
          <SortableContext
            items={benefits.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            {benefits.map((benefit, index) => (
              <SortableBenefit
                key={index}
                id={index.toString()}
                value={benefit}
                onChange={(value) => {
                  setContent((prev) => {
                    const newBenefits = [...prev.benefits];
                    newBenefits[index] = value;
                    return { ...prev, benefits: newBenefits };
                  });
                }}
                onDelete={() => {
                  setContent(
                    (prev) => ({
                      ...prev,
                      benefits: prev.benefits.filter((_, i) => i !== index),
                    }),
                    true,
                  );
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() => {
            setContent(
              (prev) => ({ ...prev, benefits: [...prev.benefits, ""] }),
              true,
            );
          }}
        >
          + Benefitを追加
        </Button>
      </div>

      <div>
        <Label className="mb-4 block text-xl font-bold">FAQ</Label>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndFaq}
        >
          <SortableContext
            items={faq.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            {faq.map((item, index) => (
              <SortableFaq
                key={index}
                id={index.toString()}
                value={item}
                onChange={(value) => {
                  setContent((prev) => {
                    const newFaq = [...prev.faq];
                    newFaq[index] = value;
                    return { ...prev, faq: newFaq };
                  });
                }}
                onDelete={() => {
                  setContent(
                    (prev) => ({
                      ...prev,
                      faq: prev.faq.filter((_, i) => i !== index),
                    }),
                    true,
                  );
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setContent(
              (prev) => ({
                ...prev,
                faq: [...prev.faq, { question: "", answer: "" }],
              }),
              true,
            );
          }}
        >
          + FAQを追加
        </Button>
      </div>

      <div>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndTestimonial}
        >
          <SortableContext
            items={testimonials.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            {testimonials.map((review, index) => (
              <SortableTestimonial
                key={index}
                id={index.toString()}
                review={review}
                onChange={(value) => {
                  setContent((prev) => {
                    const newReviews = [...prev.testimonials];
                    newReviews[index] = value;
                    return { ...prev, testimonials: newReviews };
                  });
                }}
                onDelete={() => {
                  setContent(
                    (prev) => ({
                      ...prev,
                      testimonials: prev.testimonials.filter(
                        (_, i) => i !== index,
                      ),
                    }),
                    true,
                  );
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setContent(
              (prev) => ({
                ...prev,
                testimonials: [
                  ...prev.testimonials,
                  { name: "", comment: "" },
                ],
              }),
              true,
            );
          }}
        >
          + お客様の声を追加
        </Button>
      </div>

      <div className="rounded-xl border border-slate-700 p-4">
        <p className="mb-2 text-sm text-slate-400">公開URL</p>

        <Input value={publicUrl} readOnly />

        <Button
          className="mt-3"
          onClick={() => {
            navigator.clipboard.writeText(publicUrl);
            toast.success("コピーしました！");
          }}
        >
          コピー
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          title="元に戻す (Ctrl+Z)"
          aria-label="元に戻す"
        >
          <Undo2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          title="やり直す (Ctrl+Shift+Z)"
          aria-label="やり直す"
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? "保存中..." : "保存する"}
        </Button>
      </div>
      </div>

      <div className={cn(mobileView === "edit" && "hidden lg:block")}>
        <div className="lg:sticky lg:top-6">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            ライブプレビュー
          </p>

          <div className="overflow-hidden rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2 border-b border-slate-700 bg-zinc-900 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>

            <div className="max-h-[80vh] overflow-y-auto">
              <Template item={previewItem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
