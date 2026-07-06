import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callModel } from "@/lib/ai";
import { buildChatSystemPrompt } from "@/lib/prompt";
import { checkRateLimit } from "@/lib/rateLimit";
import { DIALECTS, type DatabaseDialect } from "@/lib/types";

export const runtime = "nodejs";

const dialectValues = DIALECTS.map((d) => d.value) as [DatabaseDialect, ...DatabaseDialect[]];

const RequestSchema = z.object({
  sql: z.string().min(1),
  dialect: z.enum(dialectValues),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(10000),
      })
    )
    .max(20),
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

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const { sql, dialect, messages } = parsed.data;

  try {
    const reply = await callModel([
      { role: "system", content: buildChatSystemPrompt(dialect, sql) },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ], "text");

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
