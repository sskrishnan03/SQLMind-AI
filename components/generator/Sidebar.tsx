"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Star,
  Trash2,
  History as HistoryIcon,
  BookOpen,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { EXAMPLE_QUERIES, CATEGORIES } from "@/lib/examples";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { HistoryItem, FavoriteItem } from "@/lib/types";

interface SidebarProps {
  onSelectHistory: (item: HistoryItem) => void;
  onSelectExample: (prompt: string) => void;
}

export function Sidebar({ onSelectHistory, onSelectExample }: SidebarProps) {
  const history = useAppStore((s) => s.history);
  const favorites = useAppStore((s) => s.favorites);
  const removeHistory = useAppStore((s) => s.removeHistory);
  const removeFavorite = useAppStore((s) => s.removeFavorite);
  const clearHistory = useAppStore((s) => s.clearHistory);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filteredExamples = useMemo(() => {
    return EXAMPLE_QUERIES.filter(
      (e) => category === "All" || e.category === category
    );
  }, [category]);

  const filteredHistory = useMemo(() => {
    if (!search.trim()) return history;
    return history.filter((h) =>
      h.prompt.toLowerCase().includes(search.toLowerCase())
    );
  }, [history, search]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/80 bg-surface overflow-hidden shadow-lg shadow-black/20">
      <Tabs defaultValue="history" className="flex h-full flex-col">
        <div className="border-b border-border/50 px-3 pt-2.5 pb-0">
          <TabsList className="w-full gap-0.5 rounded-lg bg-white/[0.03] p-0.5">
            <TabsTrigger value="history" className="flex-1 rounded-md py-2 text-xs data-[state=active]:bg-accent/15 data-[state=active]:text-accent data-[state=active]:shadow-none">
              <HistoryIcon className="mr-1.5 inline h-3.5 w-3.5" />
              History
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1 rounded-md py-2 text-xs data-[state=active]:bg-accent/15 data-[state=active]:text-accent data-[state=active]:shadow-none">
              <Star className="mr-1.5 inline h-3.5 w-3.5" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex-1 rounded-md py-2 text-xs data-[state=active]:bg-accent/15 data-[state=active]:text-accent data-[state=active]:shadow-none">
              <BookOpen className="mr-1.5 inline h-3.5 w-3.5" />
              Examples
            </TabsTrigger>
          </TabsList>
        </div>

        {/* History */}
        <TabsContent value="history" className="flex-1 overflow-hidden p-0 m-0">
          <div className="border-b border-border/30 px-4 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history..."
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-xs text-white outline-none transition-all focus:border-accent/40 focus:bg-white/[0.07] focus:shadow-[0_0_12px_rgba(79,70,229,0.08)] placeholder:text-white/20"
              />
            </div>
            {history.length > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-white/20">{filteredHistory.length} of {history.length}</span>
                <button onClick={clearHistory} className="rounded-md px-2 py-1 text-[11px] text-white/25 hover:text-danger hover:bg-danger/5 transition-all">Clear all</button>
              </div>
            )}
          </div>

          <ScrollArea className="h-[calc(100%-104px)] px-3 py-2">
            {filteredHistory.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03]">
                  <Clock className="h-4 w-4 text-white/20" />
                </div>
                <p className="text-xs text-white/25 max-w-[180px] leading-relaxed">
                  {search ? "No matching queries found." : "No queries yet. Generate one to see it here."}
                </p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {filteredHistory.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelectHistory(item)}
                      className="group relative w-full rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition-all hover:border-accent/25 hover:bg-accent/[0.03] hover:shadow-[0_0_16px_rgba(79,70,229,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm text-white/80 leading-relaxed font-medium">
                          {item.prompt}
                        </p>
                        <Trash2
                          onClick={(e) => { e.stopPropagation(); removeHistory(item.id); }}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/15 opacity-0 transition-all hover:text-danger group-hover:opacity-100"
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-white/15" />
                        <span className="text-[11px] text-white/25">{formatRelativeTime(item.createdAt)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites" className="flex-1 overflow-hidden p-0 m-0">
          <div className="border-b border-border/30 px-4 py-2.5">
            {favorites.length > 0 && (
              <span className="text-[11px] text-white/20">{favorites.length} saved</span>
            )}
          </div>
          <ScrollArea className="h-[calc(100%-46px)] px-3 py-2">
            {favorites.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03]">
                  <Star className="h-4 w-4 text-amber-400/40" />
                </div>
                <p className="text-xs text-white/25 max-w-[180px] leading-relaxed">Star a query to save it here and access it anytime.</p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {favorites.map((item: FavoriteItem) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelectHistory(item)}
                      className="group relative w-full rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition-all hover:border-amber-400/20 hover:bg-amber-400/[0.03] hover:shadow-[0_0_16px_rgba(251,191,36,0.05)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400/40" />
                          <p className="line-clamp-2 text-sm text-white/80 leading-relaxed font-medium">{item.prompt}</p>
                        </div>
                        <Trash2
                          onClick={(e) => { e.stopPropagation(); removeFavorite(item.id); }}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/15 opacity-0 transition-all hover:text-danger group-hover:opacity-100"
                        />
                      </div>
                      <div className="mt-2 ml-5.5 flex items-center gap-2">
                        <Badge tone="accent" className="text-[10px] px-1.5 py-0.5">{item.folder}</Badge>
                        <span className="text-[11px] text-white/25">{formatRelativeTime(item.createdAt)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </TabsContent>

        {/* Examples */}
        <TabsContent value="examples" className="flex-1 overflow-hidden p-0 m-0">
          <div className="border-b border-border/30 px-4 py-3">
            <div className="flex flex-wrap gap-1.5">
              {["All", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
                    category === c
                      ? "border-accent/40 bg-accent/10 text-accent shadow-[0_0_10px_rgba(79,70,229,0.08)]"
                      : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/60"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-64px)] px-3 py-2">
            <ul className="space-y-1.5">
              {filteredExamples.map((ex) => (
                <li key={ex.id}>
                  <button
                    onClick={() => onSelectExample(ex.prompt)}
                    className="group w-full rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition-all hover:border-accent/25 hover:bg-accent/[0.03] hover:shadow-[0_0_16px_rgba(79,70,229,0.06)]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Badge tone="default" className="text-[10px] px-1.5 py-0.5 border-white/10 bg-white/[0.04] text-white/40">{ex.category}</Badge>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">{ex.prompt}</p>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
