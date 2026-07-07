import Link from "next/link";
import Image from "next/image";
import { Pencil, Globe, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTemplateBadgeVariant } from "@/lib/tag-colors";
import CopyPublicUrlButton from "@/components/CopyPublicUrlButton";
import DeleteButton from "@/components/DeleteButton";
import DownloadHtmlButton from "@/components/DownloadHtmlButton";
import DownloadZipButton from "@/components/DownloadZipButton";
import DownloadImageButton from "@/components/DownloadImageButton";
import FavoriteButton from "@/components/FavoriteButton";

import type { Generation } from "@prisma/client";

interface Props {
  item: Generation;
}

export default function GenerationCard({ item }: Props) {
  const templateName =
    item.template.charAt(0).toUpperCase() + item.template.slice(1);

  return (
    <div className="group border-border bg-card overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_60px_rgba(16,185,129,0.18)]">
      <Link href={`/lp/${item.id}`} className="block cursor-pointer">
        {item.imageUrl && (
          <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
            <Image
              src={item.imageUrl}
              alt={item.hero}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />

            <FavoriteButton id={item.id} isFavorite={item.isFavorite} />

            <div className="from-background absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />
          </div>
        )}
        <div className="p-6 pb-0">
          <h2 className="text-2xl leading-tight font-bold transition-colors duration-300 group-hover:text-emerald-400">
            {item.hero}
          </h2>

          <div className="mt-2 flex items-center gap-2">
            <Badge variant="muted">
              <Clock />
              {new Date(item.createdAt).toLocaleDateString("ja-JP")}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="blue">{item.business}</Badge>
            <Badge variant="purple">{item.target}</Badge>
            <Badge variant={getTemplateBadgeVariant(item.template)}>
              {templateName}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 truncate text-sm">
            雰囲気：
            <span className="text-foreground font-semibold">
              {item.atmosphere}
            </span>
          </p>

          <div className="text-muted-foreground mt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-muted rounded-full px-2.5 py-1">
              特徴 {item.features.length}件
            </span>

            <span className="bg-muted rounded-full px-2.5 py-1">
              ベネフィット {item.benefits.length}件
            </span>
          </div>

          <p className="text-muted-foreground mt-2 line-clamp-2 min-h-[3rem]">
            {item.cta}
          </p>
        </div>
      </Link>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
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

          {item.imageUrl && (
            <div className="flex-1">
              <DownloadImageButton
                imageUrl={item.imageUrl}
                fileName={`${item.hero}.png`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
