import {
  Wand2,
  Gauge,
  BookOpen,
  MessagesSquare,
  History,
  Download,
  Star,
  Keyboard,
} from "lucide-react";

const FEATURES = [
  {
    icon: Wand2,
    title: "AI SQL generation",
    description:
      "Describe what you need in plain English and get a syntactically correct, editable query in seconds.",
  },
  {
    icon: Gauge,
    title: "Query optimizer",
    description:
      "Spot missing indexes, expensive joins, and slow subqueries — with concrete suggestions to speed things up.",
  },
  {
    icon: BookOpen,
    title: "Line-by-line explanations",
    description:
      "Every clause explained in plain English, from SELECT to LIMIT, so you understand exactly what runs.",
  },
  {
    icon: MessagesSquare,
    title: "AI chat follow-ups",
    description:
      "Ask why a join was used, request a rewrite, or dig into an execution plan — right in the same thread.",
  },
  {
    icon: History,
    title: "History & favorites",
    description:
      "Every query you generate is saved locally. Star the ones you reuse and organize them into folders.",
  },
  {
    icon: Download,
    title: "Export anywhere",
    description:
      "Copy, download as .sql or .txt, or print a clean, formatted copy of any query.",
  },
  {
    icon: Star,
    title: "Curated example library",
    description:
      "Jumpstart with ready-made prompts across sales, HR, finance, inventory, healthcare, and more.",
  },
  {
    icon: Keyboard,
    title: "Built for speed",
    description:
      "Full keyboard shortcuts — Ctrl+Enter to generate, Ctrl+/ to focus, Ctrl+L to clear.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to ship queries faster
          </h2>
          <p className="mt-3 text-muted">
            Not just generation — explanation, optimization, and a workflow
            built around how engineers actually write SQL.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-glow"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
