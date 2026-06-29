import Link from "next/link";
import Image from "next/image";

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
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl">
      {item.imageUrl && (
        <div className="group relative h-56 w-full overflow-hidden">
          <Link href={`/lp/${item.id}`} className="absolute inset-0">
            <Image
              src={item.imageUrl}
              alt={item.hero}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          </Link>
        </div>
      )}
      <div className="p-6">
        <Link href={`/lp/${item.id}`}>
          <h2 className="text-2xl font-bold transition hover:text-emerald-400">
            {item.hero}
          </h2>
        </Link>

        <p className="mt-2 text-sm text-slate-500">
          作成日：
          {new Date(item.createdAt).toLocaleDateString("ja-JP")}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-slate-400">テンプレート</span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              item.template === "luxury"
                ? "bg-yellow-500 text-black"
                : item.template === "minimal"
                  ? "bg-gray-200 text-black"
                  : item.template === "corporate"
                    ? "bg-slate-700 text-white"
                    : "bg-blue-600 text-white"
            }`}
          >
            {templateName}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          業種：
          <span className="font-semibold">{item.business}</span>
        </p>

        <p className="mt-2 line-clamp-2 text-slate-400">{item.cta}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Link href={`/edit/${item.id}`}>
            <Button className="h-11 w-full">編集</Button>
          </Link>

          <Link href={`/lp/${item.id}`}>
            <Button className="h-11 w-full bg-emerald-600 hover:bg-emerald-500">
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
