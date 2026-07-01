"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/DeleteButton";
import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Generation = {
  id: string;
  hero: string;
  business: string;
  cta: string;
  imageUrl: string | null;
  createdAt: Date;
  features: unknown;
};

export default function HistoryList({ data }: { data: Generation[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const filteredData = data.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.hero.toLowerCase().includes(keyword) ||
      item.business.toLowerCase().includes(keyword) ||
      item.cta.toLowerCase().includes(keyword)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (sort === "business") {
      return a.business.localeCompare(b.business, "ja");
    }

    return 0;
  });

  return (
    <>
      <div className="mb-6 flex gap-4">
        <Input
          type="text"
          placeholder="🔍 タイトル・業種で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />

        <div>
          <Label className="sr-only">並び替え</Label>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-10 w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">新しい順</SelectItem>
              <SelectItem value="oldest">古い順</SelectItem>
              <SelectItem value="business">業種順</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-card border-border rounded-xl border p-10 text-center">
          <h2 className="text-2xl font-bold">該当する履歴がありません</h2>

          <p className="text-muted-foreground mt-2">
            検索条件を変更してください。
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedData.map((item) => (
            <div key={item.id}>
              <div className="bg-card border-border overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_60px_rgba(16,185,129,0.18)]">
                {item.imageUrl && (
                  <div className="relative">
                    <Link href={`/history/${item.id}`}>
                      <Image
                        src={item.imageUrl}
                        alt={item.business}
                        width={800}
                        height={224}
                        className="h-56 w-full object-cover object-center"
                      />
                    </Link>
                    <div className="text-foreground absolute top-3 right-3 rounded bg-black/70 px-2 py-1 text-xs">
                      {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <p className="bg-muted text-muted-foreground inline-flex rounded-full px-3 py-1 text-sm">
                    {item.business}
                  </p>

                  <Link href={`/history/${item.id}`} className="mb-4 block">
                    <h2 className="line-clamp-2 text-xl font-bold transition-colors hover:text-emerald-400">
                      {item.hero}
                    </h2>
                  </Link>

                  <p className="text-muted-foreground mb-4 text-sm">
                    {item.cta}
                  </p>

                  <div className="space-y-2">
                    {Array.isArray(item.features) &&
                      item.features.slice(0, 2).map((feature, index) => (
                        <div
                          key={index}
                          className="bg-muted text-muted-foreground rounded-lg p-3"
                        >
                          {String(feature)}
                        </div>
                      ))}
                  </div>

                  {Array.isArray(item.features) && item.features.length > 2 && (
                    <p className="text-muted-foreground text-sm">
                      +{item.features.length - 2}件
                    </p>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link href={`/preview/${item.id}`} target="_blank">
                      <Button className="h-10 w-full bg-blue-600 hover:bg-blue-700">
                        LPプレビュー
                      </Button>
                    </Link>

                    <DeleteButton id={item.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
