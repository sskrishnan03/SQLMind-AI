import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callModel, parseJsonResponse } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/prompt";
import { checkRateLimit } from "@/lib/rateLimit";
import { DIALECTS, type DatabaseDialect } from "@/lib/types";

export const runtime = "nodejs";

const dialectValues = DIALECTS.map((d) => d.value) as [DatabaseDialect, ...DatabaseDialect[]];

const RequestSchema = z.object({
  prompt: z.string().trim().min(3, "Prompt is too short.").max(2000, "Prompt is too long."),
  dialect: z.enum(dialectValues),
});

const ResultSchema = z.object({
  sql: z.string().min(1),
  explanation: z.string(),
  optimization: z.string(),
  complexity: z.object({
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    timeComplexity: z.string(),
    estimatedCost: z.string(),
    notes: z.string(),
  }),
  compatibility: z.string(),
  warnings: z.string(),
});

function getClientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "anonymous";
}

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req);
  const { allowed } = checkRateLimit(clientKey);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedRequest = RequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: parsedRequest.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const { prompt, dialect } = parsedRequest.data;

  // Basic prompt-injection guardrail: strip obvious instruction-override
  // attempts before they reach the model. The system prompt also instructs
  // the model to ignore embedded instructions, this is defense in depth.
  const sanitizedPrompt = prompt.replace(
    /ignore (all|previous|the) instructions/gi,
    "[filtered]"
  );

  try {
    const raw = await callModel([
      { role: "system", content: buildSystemPrompt(dialect) },
      { role: "user", content: sanitizedPrompt },
    ]);

    const parsedJson = parseJsonResponse<unknown>(raw);
    const result = ResultSchema.safeParse(parsedJson);

    if (!result.success) {
      return NextResponse.json(
        { error: "The model returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ result: result.data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
