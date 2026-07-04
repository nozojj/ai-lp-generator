import Link from "next/link";
import Image from "next/image";
import { Pencil, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import CopyPublicUrlButton from "@/components/CopyPublicUrlButton";
import DeleteButton from "@/components/DeleteButton";
import DownloadHtmlButton from "@/components/DownloadHtmlButton";
import DownloadZipButton from "@/components/DownloadZipButton";

import type { Generation } from "@prisma/client";

interface Props {
  item: Generation;
}

export default function GenerationCard({ item }: Props) {
  const templateName =
    item.template.charAt(0).toUpperCase() + item.template.slice(1);

  return (
    <div className="group border-border bg-card overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_60px_rgba(16,185,129,0.18)]">
      {item.imageUrl && (
        <div className="relative h-56 w-full overflow-hidden">
          <Link href={`/lp/${item.id}`} className="absolute inset-0 z-10" />

          <Image
            src={item.imageUrl}
            alt={item.hero}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />

          <div className="from-background absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />
        </div>
      )}
      <div className="p-6">
        <Link href={`/lp/${item.id}`} className="block">
          <h2 className="text-2xl leading-tight font-bold transition-colors duration-300 group-hover:text-emerald-400">
            {item.hero}
          </h2>
        </Link>

        <p className="text-muted-foreground mt-2 text-sm">
          作成日：
          {new Date(item.createdAt).toLocaleDateString("ja-JP")}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-muted-foreground text-sm">テンプレート</span>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${
              item.template === "luxury"
                ? "border-amber-500/30 bg-amber-500/20 text-amber-300"
                : item.template === "minimal"
                  ? "border-gray-400/30 bg-gray-500/20 text-gray-300"
                  : item.template === "corporate"
                    ? "border-slate-500/30 bg-slate-700/30 text-slate-200"
                    : "border-blue-500/30 bg-blue-500/20 text-blue-300"
            }`}
          >
            {templateName}
          </span>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          業種：
          <span className="font-semibold">{item.business}</span>
        </p>

        <p className="text-muted-foreground mt-2 line-clamp-2 min-h-[3rem]">
          {item.cta}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Link href={`/edit/${item.id}`}>
            <Button className="h-11 w-full">
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>

          <Link href={`/lp/${item.id}`}>
            <Button className="h-11 w-full bg-emerald-600 hover:bg-emerald-500">
              <Globe className="mr-2 h-4 w-4" />
              公開LP
            </Button>
          </Link>
          <div className="flex-1">
            <DownloadHtmlButton id={item.id} />
          </div>

          <div className="w-full">
            <CopyPublicUrlButton id={item.id} />
          </div>

          <div className="flex-1">
            <DeleteButton id={item.id} />
          </div>

          <div className="flex-1">
            <DownloadZipButton id={item.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
