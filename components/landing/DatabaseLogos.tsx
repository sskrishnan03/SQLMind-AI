import { Database } from "lucide-react";

const DATABASES = [
  "PostgreSQL",
  "MySQL",
  "MariaDB",
  "SQLite",
  "MongoDB",
  "Oracle",
  "SQL Server",
];

export function DatabaseLogos() {
  return (
    <section className="border-y border-border bg-surface/40 px-6 py-10">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted">
        Works with every database you already use
      </p>
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {DATABASES.map((name) => (
          <div
            key={name}
            className="flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <Database className="h-4 w-4" />
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}
