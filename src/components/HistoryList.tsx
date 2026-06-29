"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/DeleteButton";
import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
          <Label htmlFor="sort" className="sr-only">
            並び替え
          </Label>

          <select
            id="sort"
            aria-label="並び替え"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
          >
            <option value="newest">新しい順</option>
            <option value="oldest">古い順</option>
            <option value="business">業種順</option>
          </select>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 p-10 text-center">
          <h2 className="text-2xl font-bold">該当する履歴がありません</h2>

          <p className="mt-2 text-zinc-400">検索条件を変更してください。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedData.map((item) => (
            <div key={item.id}>
              <Link href={`/history/${item.id}`}>
                <div className="cursor-pointer overflow-hidden rounded-xl bg-zinc-900 transition duration-200 hover:scale-[1.01] hover:bg-zinc-800">
                  {item.imageUrl && (
                    <div className="relative">
                      <Image
                        src={item.imageUrl}
                        alt={item.business}
                        width={800}
                        height={224}
                        className="h-56 w-full object-cover object-center"
                      />
                      <div className="absolute top-3 right-3 rounded bg-black/70 px-2 py-1 text-xs text-white">
                        {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <p className="mb-2 text-zinc-400">{item.business}</p>

                    <h2 className="mb-4 line-clamp-2 text-xl font-bold">
                      {item.hero}
                    </h2>

                    <p className="mb-4 text-sm text-zinc-400">{item.cta}</p>

                    <div className="space-y-2">
                      {Array.isArray(item.features) &&
                        item.features.slice(0, 2).map((feature, index) => (
                          <div
                            key={index}
                            className="rounded-lg bg-zinc-800 p-3"
                          >
                            {String(feature)}
                          </div>
                        ))}
                    </div>

                    {Array.isArray(item.features) &&
                      item.features.length > 2 && (
                        <p className="text-sm text-zinc-500">
                          +{item.features.length - 2}件
                        </p>
                      )}
                  </div>
                </div>
              </Link>

              <div className="mt-3 flex gap-3">
                <Link href={`/preview/${item.id}`} target="_blank">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    LPプレビュー
                  </Button>
                </Link>

                <DeleteButton id={item.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
