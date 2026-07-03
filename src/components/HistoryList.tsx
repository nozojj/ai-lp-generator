"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Input } from "./ui/input";

type Generation = {
  id: string;
  hero: string;
  business: string;
  cta: string;
  imageUrl: string | null;
  createdAt: Date;
  features: unknown;
};

type Group = {
  label: string;
  items: Generation[];
};

function groupByDate(data: Generation[]): Group[] {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  const groups: Group[] = [
    { label: "今日", items: [] },
    { label: "今週", items: [] },
    { label: "それ以前", items: [] },
  ];

  for (const item of data) {
    const createdAt = new Date(item.createdAt);

    if (createdAt >= startOfToday) {
      groups[0].items.push(item);
    } else if (createdAt >= startOfWeek) {
      groups[1].items.push(item);
    } else {
      groups[2].items.push(item);
    }
  }

  return groups.filter((group) => group.items.length > 0);
}

export default function HistoryList({ data }: { data: Generation[] }) {
  const [search, setSearch] = useState("");

  const keyword = search.toLowerCase();
  const filteredData = data.filter((item) => {
    return (
      item.hero.toLowerCase().includes(keyword) ||
      item.business.toLowerCase().includes(keyword) ||
      item.cta.toLowerCase().includes(keyword)
    );
  });

  const groups = groupByDate(filteredData);

  return (
    <>
      <Input
        type="text"
        placeholder="🔍 タイトル・業種で検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {groups.length === 0 ? (
        <div className="bg-card border-border rounded-xl border p-10 text-center">
          <h2 className="text-2xl font-bold">該当する履歴がありません</h2>

          <p className="text-muted-foreground mt-2">
            検索条件を変更してください。
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
                {group.label} ({group.items.length}件)
              </h3>

              <div className="space-y-2">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/history/${item.id}`}
                    className="bg-card border-border flex items-center gap-4 rounded-xl border p-3 transition-colors hover:border-emerald-500/40"
                  >
                    <div className="bg-muted relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.hero}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                          <ImageOff size={16} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold">{item.hero}</h4>

                      <span className="bg-muted text-muted-foreground mt-1 inline-flex rounded-full px-3 py-1 text-xs">
                        {item.business}
                      </span>
                    </div>

                    <span className="text-muted-foreground shrink-0 text-xs">
                      {new Date(item.createdAt).toLocaleString("ja-JP", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
