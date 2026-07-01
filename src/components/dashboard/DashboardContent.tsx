"use client";

import { useMemo, useState } from "react";
import GenerationCard from "./GenerationCard";
import type { Generation } from "@prisma/client";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  generations: Generation[];
};

export default function DashboardContent({ generations }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const keyword = search.toLowerCase();
  const filtered = useMemo(() => {
    return generations
      .filter((item) => {
        return (
          item.business.toLowerCase().includes(keyword) ||
          item.hero.toLowerCase().includes(keyword) ||
          item.target.toLowerCase().includes(keyword) ||
          item.atmosphere.toLowerCase().includes(keyword) ||
          item.template.toLowerCase().includes(keyword)
        );
      })
      .sort((a, b) => {
        switch (sort) {
          case "oldest":
            return a.createdAt.getTime() - b.createdAt.getTime();

          case "business":
            return a.business.localeCompare(b.business);

          case "template":
            return a.template.localeCompare(b.template);

          default:
            return b.createdAt.getTime() - a.createdAt.getTime();
        }
      });
  }, [generations, keyword, sort]);
  return (
    <>
      <div className="relative mb-6">
        <Search
          size={18}
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="LPを検索..."
          className="pl-10"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="検索をクリア"
            title="検索をクリア"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          検索結果：{filtered.length}件
        </p>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40">
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

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="border-border bg-card rounded-xl border p-10 text-center">
            <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />

            <h3 className="text-lg font-semibold">LPが見つかりません</h3>

            <p className="text-muted-foreground mt-2">
              検索キーワードを変更してください。
            </p>
          </div>
        ) : (
          filtered.map((item) => <GenerationCard key={item.id} item={item} />)
        )}
      </div>
    </>
  );
}
