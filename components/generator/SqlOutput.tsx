"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  Copy,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2,
  Star,
  Printer,
  MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, copyToClipboard, downloadFile } from "@/lib/utils";
import type { DatabaseDialect } from "@/lib/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full shimmer-bg animate-shimmer rounded-lg" />
  ),
});

interface SqlOutputProps {
  sql: string;
  onChange: (sql: string) => void;
  onRegenerate: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  loading: boolean;
  dialect?: DatabaseDialect;
  onOpenChat?: () => void;
}

export function SqlOutput({
  sql,
  onChange,
  onRegenerate,
  onToggleFavorite,
  isFavorite,
  loading,
  dialect = "postgresql",
  onOpenChat,
}: SqlOutputProps) {
  const [fullscreen, setFullscreen] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(sql);
    if (ok) toast.success("SQL copied to clipboard");
    else toast.error("Couldn't copy — copy manually instead");
  }

  function handleDownload(ext: "sql" | "txt") {
    downloadFile(`query.${ext}`, sql, ext === "sql" ? "text/plain" : "text/plain");
    toast.success(`Downloaded query.${ext}`);
  }

  function handlePrint() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<pre style="font-family:monospace;white-space:pre-wrap;padding:24px;">${sql
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</pre>`
    );
    win.document.close();
    win.print();
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface",
        fullscreen && "fixed inset-4 z-50 flex flex-col shadow-soft"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs font-medium text-muted">SQL Output</span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenChat}
            className="gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60 hover:shadow-[0_0_12px_rgba(79,70,229,0.15)] transition-all"
            title="Ask about this query"
          >
            <MessagesSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">Ask AI</span>
          </Button>

          <span className="mx-1 h-5 w-px bg-border" />

          <Button size="icon" variant="ghost" onClick={onToggleFavorite} title="Favorite">
            <Star
              className={cn("h-4 w-4", isFavorite && "fill-warning text-warning")}
            />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCopy} title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDownload("sql")} title="Download .sql">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handlePrint} title="Print">
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onRegenerate}
            disabled={loading}
            title="Regenerate"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setFullscreen((f) => !f)}
            title="Fullscreen"
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={cn("h-64", fullscreen && "h-full flex-1")}>
        <MonacoEditor
          language={dialect === "mongodb" ? "json" : "sql"}
          theme="vs-dark"
          value={sql}
          onChange={(v) => onChange(v ?? "")}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            fontFamily: "var(--font-jetbrains)",
            lineNumbers: "on",
            renderLineHighlight: "none",
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
