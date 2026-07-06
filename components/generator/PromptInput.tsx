"use client";

import { forwardRef } from "react";
import { X, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatabaseSelector } from "./DatabaseSelector";
import type { DatabaseDialect } from "@/lib/types";

const MAX_CHARS = 2000;

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  dialect: DatabaseDialect;
  onDialectChange: (value: DatabaseDialect) => void;
  onGenerate: () => void;
  loading: boolean;
}

export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({ value, onChange, dialect, onDialectChange, onGenerate, loading }, ref) => {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-white">
            Describe the query you need
          </label>
          <DatabaseSelector value={dialect} onChange={onDialectChange} />
        </div>

        <div className="relative">
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Example: Find all customers from India who ordered in the last 30 days."
            rows={5}
            className="pr-9"
          />
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear input"
              className="absolute right-2.5 top-2.5 rounded-md p-1 text-muted transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted">
            {value.length}/{MAX_CHARS} characters &middot;{" "}
            <kbd className="rounded border border-border bg-[#161616] px-1.5 py-0.5 font-mono text-[11px]">
              Ctrl
            </kbd>
            +
            <kbd className="rounded border border-border bg-[#161616] px-1.5 py-0.5 font-mono text-[11px]">
              Enter
            </kbd>{" "}
            to generate
          </span>

          <Button
            onClick={onGenerate}
            disabled={loading || value.trim().length < 3}
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating..." : "Generate SQL"}
          </Button>
        </div>
      </div>
    );
  }
);
PromptInput.displayName = "PromptInput";
