import { Database, Sparkles } from "lucide-react";

export function ResultSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-64 w-full animate-shimmer shimmer-bg rounded-xl border border-border" />
      <div className="h-40 w-full animate-shimmer shimmer-bg rounded-xl border border-border" />
    </div>
  );
}

export function EmptyResultState() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Database className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-medium text-white">No query yet</h3>
      <p className="max-w-xs text-sm text-muted">
        Describe what you need in plain English, or pick an example from the
        sidebar, then generate.
      </p>
      <div className="flex items-center gap-1.5 text-xs text-muted">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        Try: &ldquo;Show monthly revenue for the last year&rdquo;
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-danger/30 bg-danger/5 p-10 text-center">
      <h3 className="text-sm font-medium text-danger">Generation failed</h3>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg border border-border px-3 py-1.5 text-xs text-white transition-colors hover:border-accent/40"
      >
        Try again
      </button>
    </div>
  );
}
