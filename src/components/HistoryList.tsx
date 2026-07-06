"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpDown, ImageOff, Clock } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getTemplateBadgeVariant } from "@/lib/tag-colors";

type Generation = {
  id: string;
  hero: string;
  business: string;
  target: string;
  template: string;
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
  const [sort, setSort] = useState("newest");

  const keyword = search.toLowerCase();
  const filteredData = data
    .filter((item) => {
      return (
        item.hero.toLowerCase().includes(keyword) ||
        item.business.toLowerCase().includes(keyword) ||
        item.cta.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "business":
          return a.business.localeCompare(b.business);

        case "template":
          return a.template.localeCompare(b.template);

        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const groups = groupByDate(filteredData);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="text"
          placeholder="🔍 タイトル・業種で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40 shrink-0">
            <ArrowUpDown className="mr-1 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">新しい順</SelectItem>

            <SelectItem value="oldest">古い順</SelectItem>

            <SelectItem value="business">業種順</SelectItem>

            <SelectItem value="template">テンプレート順</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
                    className="bg-card border-border flex items-center gap-4 rounded-xl border p-3 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg"
                  >
                    <div className="bg-muted relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
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

                      <p className="text-muted-foreground mt-1 truncate text-sm">
                        {item.cta}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="blue">{item.business}</Badge>

                        <Badge variant="purple">{item.target}</Badge>

                        <Badge
                          variant={getTemplateBadgeVariant(item.template)}
                          className="capitalize"
                        >
                          {item.template}
                        </Badge>
                      </div>
                    </div>

                    <Badge variant="muted" className="shrink-0">
                      <Clock />
                      {new Date(item.createdAt).toLocaleString("ja-JP", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Badge>
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
