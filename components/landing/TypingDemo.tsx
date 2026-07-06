"use client";

import { useEffect, useState } from "react";
import { Database } from "lucide-react";

const PROMPT = "Show the top 10 customers who spent the most this year.";
const SQL_LINES = [
  "SELECT c.customer_name, SUM(o.total_amount) AS total_spent",
  "FROM customers c",
  "JOIN orders o ON o.customer_id = c.id",
  "WHERE o.created_at >= date_trunc('year', now())",
  "GROUP BY c.customer_name",
  "ORDER BY total_spent DESC",
  "LIMIT 10;",
];

export function TypingDemo() {
  const [promptText, setPromptText] = useState("");
  const [sqlVisibleLines, setSqlVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"prompt" | "sql" | "done">("prompt");

  useEffect(() => {
    if (phase !== "prompt") return;
    if (promptText.length < PROMPT.length) {
      const t = setTimeout(
        () => setPromptText(PROMPT.slice(0, promptText.length + 1)),
        28
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("sql"), 500);
    return () => clearTimeout(t);
  }, [promptText, phase]);

  useEffect(() => {
    if (phase !== "sql") return;
    if (sqlVisibleLines < SQL_LINES.length) {
      const t = setTimeout(() => setSqlVisibleLines((n) => n + 1), 180);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("done"), 1200);
    return () => clearTimeout(t);
  }, [sqlVisibleLines, phase]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => {
      setPromptText("");
      setSqlVisibleLines(0);
      setPhase("prompt");
    }, 2200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="glass overflow-hidden rounded-xl border border-border text-left shadow-glow">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <span className="ml-2 flex items-center gap-1.5 text-xs text-muted">
          <Database className="h-3.5 w-3.5" /> PostgreSQL
        </span>
      </div>

      <div className="space-y-3 p-5">
        <div className="rounded-lg border border-border bg-[#161616] px-3.5 py-2.5 font-mono text-[13px] text-white/90">
          {promptText}
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-accent align-middle" />
        </div>

        <div className="min-h-[168px] rounded-lg border border-border bg-[#0f0f0f] px-3.5 py-3 font-mono text-[13px] leading-relaxed">
          {SQL_LINES.slice(0, sqlVisibleLines).map((line, i) => (
            <div key={i} className="animate-fade-in text-accent/90">
              <span className="mr-3 select-none text-white/20">{i + 1}</span>
              <span className="text-white/90">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
