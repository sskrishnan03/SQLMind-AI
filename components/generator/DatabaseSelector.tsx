"use client";

import { Database } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIALECTS, type DatabaseDialect } from "@/lib/types";

interface DatabaseSelectorProps {
  value: DatabaseDialect;
  onChange: (value: DatabaseDialect) => void;
}

export function DatabaseSelector({ value, onChange }: DatabaseSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DatabaseDialect)}>
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-accent" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {DIALECTS.map((d) => (
          <SelectItem key={d.value} value={d.value}>
            {d.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
