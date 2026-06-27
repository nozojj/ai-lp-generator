"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableFeature from "./SortableFeature";
import SortableTestimonial from "./SortableTestimonial";
import SortableBenefit from "./SortableBenefit";
import SortableFaq from "./SortableFaq";

export default function EditForm({
  id,
  hero: initialHero,
  cta: initialCta,
  imageUrl: initialImageUrl,
  features: initialFeatures,
  benefits: initialBenefits,
  faq: initialFaq,
  testimonials: initialTestimonials,
}: {
  id: string;
  hero: string;
  cta: string;
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
  const [hero, setHero] = useState(initialHero);
  const [cta, setCta] = useState(initialCta);
  const [features, setFeatures] = useState(initialFeatures);
  const [benefits, setBenefits] = useState(initialBenefits);
  const [faq, setFaq] = useState(initialFaq);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const [testimonials, setTestimonials] = useState(
    initialTestimonials?.length
      ? initialTestimonials
      : [
          { name: "", comment: "" },
          { name: "", comment: "" },
          { name: "", comment: "" },
        ],
  );
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/lp/${id}` : "";
  const preview = useMemo(() => {
    if (!image) return initialImageUrl;
    return URL.createObjectURL(image);
  }, [image, initialImageUrl]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = features.findIndex((_, i) => i.toString() === active.id);
    const newIndex = features.findIndex((_, i) => i.toString() === over.id);

    setFeatures(arrayMove(features, oldIndex, newIndex));
  }

  function handleDragEndBenefit(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = benefits.findIndex((_, i) => i.toString() === active.id);
    const newIndex = benefits.findIndex((_, i) => i.toString() === over.id);

    setBenefits(arrayMove(benefits, oldIndex, newIndex));
  }

  function handleDragEndFaq(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = faq.findIndex((_, i) => i.toString() === active.id);
    const newIndex = faq.findIndex((_, i) => i.toString() === over.id);

    setFaq(arrayMove(faq, oldIndex, newIndex));
  }

  function handleDragEndTestimonial(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex(
      (_, i) => i.toString() === active.id,
    );

    const newIndex = testimonials.findIndex((_, i) => i.toString() === over.id);

    setTestimonials(arrayMove(testimonials, oldIndex, newIndex));
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

      setHero(data.hero);
      setCta(data.cta);
      setFeatures(data.features);
      setBenefits(data.benefits);
      setFaq(data.faq);
      setTestimonials(data.testimonials);

      toast.success("AIが改善しました！");
    } catch (error) {
      console.error(error);
      toast.error("通信エラー");
    } finally {
      setIsImproving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block font-bold">Hero</Label>
        <Input
          value={hero}
          onChange={(e) => setHero(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <Label className="mb-2 block font-bold">CTA</Label>
        <Textarea
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
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
                  const newFeatures = [...features];
                  newFeatures[index] = value;
                  setFeatures(newFeatures);
                }}
                onDelete={() => {
                  setFeatures(features.filter((_, i) => i !== index));
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFeatures([...features, ""]);
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
                  const newBenefits = [...benefits];
                  newBenefits[index] = value;
                  setBenefits(newBenefits);
                }}
                onDelete={() => {
                  setBenefits(benefits.filter((_, i) => i !== index));
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
            setBenefits([...benefits, ""]);
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
                  const newFaq = [...faq];
                  newFaq[index] = value;
                  setFaq(newFaq);
                }}
                onDelete={() => {
                  setFaq(faq.filter((_, i) => i !== index));
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFaq([
              ...faq,
              {
                question: "",
                answer: "",
              },
            ]);
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
                  const newReviews = [...testimonials];
                  newReviews[index] = value;
                  setTestimonials(newReviews);
                }}
                onDelete={() => {
                  setTestimonials(testimonials.filter((_, i) => i !== index));
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setTestimonials([
              ...testimonials,
              {
                name: "",
                comment: "",
              },
            ]);
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

      <Button type="button" onClick={handleSave} disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSaving ? "保存中..." : "保存する"}
      </Button>
    </div>
  );
}
