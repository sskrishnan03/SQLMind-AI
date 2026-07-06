import Link from "next/link";
import { Database } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white">
          <Database className="h-4 w-4 text-accent" />
          SQLMind AI
        </Link>

      </div>
    </footer>
  );
}
