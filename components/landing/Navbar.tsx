import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
            <Database className="h-4 w-4 text-white" />
          </div>
          SQLMind AI
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <a href="/#features" className="transition-colors hover:text-white">
            Features
          </a>
          <a href="/#databases" className="transition-colors hover:text-white">
            Databases
          </a>
        </nav>

        <Link href="/generator">
          <Button size="sm">
            Generate SQL Query <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
