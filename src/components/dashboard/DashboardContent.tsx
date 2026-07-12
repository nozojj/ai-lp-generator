"use client";

import { useMemo, useState } from "react";
import GenerationCard from "./GenerationCard";
import type { Generation } from "@prisma/client";
import { Input } from "../ui/input";
import {
  ArrowUpDown,
  Filter,
  Globe,
  LayoutGrid,
  Search,
  Star,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
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

const TEMPLATE_OPTIONS = ["modern", "luxury", "minimal", "corporate"];

export default function DashboardContent({ generations }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

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
      .filter((item) => {
        return templateFilter === "all" || item.template === templateFilter;
      })
      .filter((item) => {
        return !favoritesOnly || item.isFavorite;
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
  }, [generations, keyword, templateFilter, favoritesOnly, sort]);

  const stats = useMemo(
    () => [
      {
        label: "総LP数",
        value: generations.length,
        icon: LayoutGrid,
        accent: "text-emerald-500",
      },
      {
        label: "公開中",
        value: generations.filter((item) => item.isPublished).length,
        icon: Globe,
        accent: "text-blue-500",
      },
      {
        label: "お気に入り",
        value: generations.filter((item) => item.isFavorite).length,
        icon: Star,
        accent: "text-yellow-500",
      },
    ],
    [generations],
  );

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="border-border bg-card flex items-center gap-3 rounded-xl border p-4 shadow-sm"
          >
            <div className={cn("bg-muted rounded-lg p-2", accent)}>
              <Icon className="h-5 w-5" />
            </div>

            <div>
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
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

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={cn(
              "shrink-0",
              favoritesOnly && "border-yellow-400 text-yellow-500",
            )}
          >
            <Star
              className={cn("mr-1 h-4 w-4", favoritesOnly && "fill-yellow-400")}
            />
            お気に入り
          </Button>

          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger className="w-36">
              <Filter className="mr-1 h-4 w-4" />
              <SelectValue placeholder="フィルター" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">すべてのテンプレート</SelectItem>

              {TEMPLATE_OPTIONS.map((template) => (
                <SelectItem key={template} value={template} className="capitalize">
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40">
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
      </div>

      <p className="text-muted-foreground mb-6 text-sm">
        検索結果：{filtered.length}件
      </p>

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
