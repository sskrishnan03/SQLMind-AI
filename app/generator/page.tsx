"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Database, PanelLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/generator/PromptInput";
import { SqlOutput } from "@/components/generator/SqlOutput";
import { InsightPanels } from "@/components/generator/InsightPanels";
import { Sidebar } from "@/components/generator/Sidebar";
import { ChatWorkspace } from "@/components/generator/ChatWorkspace";
import { ResultSkeleton, EmptyResultState, ErrorState } from "@/components/generator/States";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAppStore } from "@/store/useAppStore";
import type { DatabaseDialect, GenerateResult, HistoryItem } from "@/lib/types";

const DEMO_PROMPT = "Find all customers from India who ordered in the last 30 days.";

export default function GeneratorPage() {
  return (
    <Suspense fallback={null}>
      <GeneratorContent />
    </Suspense>
  );
}

function GeneratorContent() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [dialect, setDialect] = useState<DatabaseDialect>("postgresql");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [chatWorkspaceOpen, setChatWorkspaceOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addHistory = useAppStore((s) => s.addHistory);
  const addFavorite = useAppStore((s) => s.addFavorite);
  const removeFavorite = useAppStore((s) => s.removeFavorite);
  const isFavorite = useAppStore((s) => s.isFavorite);

  useEffect(() => {
    if (searchParams.get("demo") === "1") {
      setPrompt(DEMO_PROMPT);
    }
  }, [searchParams]);

  const handleGenerate = useCallback(async () => {
    if (prompt.trim().length < 3 || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, dialect }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      const generated: GenerateResult = data.result;
      setResult(generated);

      const historyItem = addHistory({ prompt, dialect, result: generated });
      setActiveHistoryId(historyItem.id);
      toast.success("SQL generated");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [prompt, dialect, loading, addHistory]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setPrompt(item.prompt);
    setDialect(item.dialect);
    setResult(item.result);
    setActiveHistoryId(item.id);
    setError(null);
  }, []);

  const handleSelectExample = useCallback((examplePrompt: string) => {
    setPrompt(examplePrompt);
    textareaRef.current?.focus();
  }, []);

  const handleToggleFavorite = useCallback(() => {
    if (!result || !activeHistoryId) {
      toast.error("Generate a query first");
      return;
    }
    if (isFavorite(activeHistoryId)) {
      removeFavorite(activeHistoryId);
      toast("Removed from favorites");
    } else {
      addFavorite({
        id: activeHistoryId,
        prompt,
        dialect,
        result,
        createdAt: Date.now(),
      });
      toast.success("Added to favorites");
    }
  }, [result, activeHistoryId, prompt, dialect, isFavorite, addFavorite, removeFavorite]);

  const onFocusInput = useCallback(() => textareaRef.current?.focus(), []);
  const onClear = useCallback(() => setPrompt(""), []);

  useKeyboardShortcuts({
    onGenerate: handleGenerate,
    onFocusInput,
    onClear,
  });

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white">
          <ArrowLeft className="h-4 w-4 text-muted" />
          <Database className="h-4 w-4 text-accent" />
          SQLMind AI
        </Link>
        <span className="hidden text-xs text-muted sm:block">
          Ctrl+Enter to generate &middot; Ctrl+/ to focus &middot; Ctrl+L to clear
        </span>

        <div className="flex items-center gap-1.5 lg:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" title="History & examples">
                <PanelLeft className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent title="History, favorites & examples" className="h-[85vh] max-w-lg p-0">
              <div className="h-full p-3">
                <Sidebar onSelectHistory={handleSelectHistory} onSelectExample={handleSelectExample} />
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="hidden overflow-hidden lg:block">
          <Sidebar onSelectHistory={handleSelectHistory} onSelectExample={handleSelectExample} />
        </aside>

        <main className="flex flex-col gap-4 overflow-y-auto pr-1">
          <PromptInput
            ref={textareaRef}
            value={prompt}
            onChange={setPrompt}
            dialect={dialect}
            onDialectChange={setDialect}
            onGenerate={handleGenerate}
            loading={loading}
          />

          {loading && !result && <ResultSkeleton />}

          {error && !loading && <ErrorState message={error} onRetry={handleGenerate} />}

          {!error && !loading && !result && <EmptyResultState />}

          {result && (
            <>
              <SqlOutput
                sql={result.sql}
                onChange={(sql) => setResult({ ...result, sql })}
                onRegenerate={handleGenerate}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={activeHistoryId ? isFavorite(activeHistoryId) : false}
                loading={loading}
                dialect={dialect}
                onOpenChat={() => setChatWorkspaceOpen(true)}
              />
              <div className="rounded-xl border border-border bg-surface p-4">
                <InsightPanels result={result} />
              </div>
            </>
          )}
        </main>

      </div>

      <ChatWorkspace
        open={chatWorkspaceOpen}
        onClose={() => setChatWorkspaceOpen(false)}
        sql={result?.sql ?? ""}
        dialect={dialect}
      />
    </div>
  );
}
