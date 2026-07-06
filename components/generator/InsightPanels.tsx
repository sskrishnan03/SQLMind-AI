"use client";

import { AlertTriangle, Gauge, Layers, Lightbulb, ListChecks } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { GenerateResult, Difficulty } from "@/lib/types";

const difficultyTone: Record<Difficulty, "success" | "warning" | "danger"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
};

function TextBlock({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed text-white/85">
      {text
        .split("\n")
        .filter(Boolean)
        .map((line, i) => (
          <p key={i}>{line.replace(/^[-•]\s*/, "")}</p>
        ))}
    </div>
  );
}

export function InsightPanels({ result }: { result: GenerateResult }) {
  return (
    <Tabs defaultValue="explanation" className="w-full">
      <TabsList className="mb-4 flex-wrap">
        <TabsTrigger value="explanation">
          <ListChecks className="mr-1.5 inline h-3.5 w-3.5" />
          Explanation
        </TabsTrigger>
        <TabsTrigger value="optimization">
          <Lightbulb className="mr-1.5 inline h-3.5 w-3.5" />
          Optimizer
        </TabsTrigger>
        <TabsTrigger value="complexity">
          <Gauge className="mr-1.5 inline h-3.5 w-3.5" />
          Complexity
        </TabsTrigger>
        <TabsTrigger value="compatibility">
          <Layers className="mr-1.5 inline h-3.5 w-3.5" />
          Compatibility
        </TabsTrigger>
      </TabsList>

      <TabsContent value="explanation">
        <TextBlock text={result.explanation} />
      </TabsContent>

      <TabsContent value="optimization">
        <TextBlock text={result.optimization} />
      </TabsContent>

      <TabsContent value="complexity">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-[#161616] p-3.5">
            <p className="mb-1.5 text-xs text-muted">Difficulty</p>
            <Badge tone={difficultyTone[result.complexity.difficulty]}>
              {result.complexity.difficulty}
            </Badge>
          </div>
          <div className="rounded-lg border border-border bg-[#161616] p-3.5">
            <p className="mb-1.5 text-xs text-muted">Time complexity</p>
            <p className="font-mono text-sm text-white">
              {result.complexity.timeComplexity}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-[#161616] p-3.5">
            <p className="mb-1.5 text-xs text-muted">Estimated cost</p>
            <p className="text-sm text-white">{result.complexity.estimatedCost}</p>
          </div>
        </div>
        {result.complexity.notes && (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {result.complexity.notes}
          </p>
        )}
      </TabsContent>

      <TabsContent value="compatibility">
        <TextBlock text={result.compatibility} />
      </TabsContent>

      {result.warnings && (
        <div className="mt-4 flex gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3.5 text-sm text-warning">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{result.warnings}</p>
        </div>
      )}
    </Tabs>
  );
}
