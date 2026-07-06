export interface ChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

function buildGeminiBody(messages: ChatTurn[], responseType: "json" | "text" = "json") {
  const systemMessage = messages.find((m) => m.role === "system")?.content ?? "";
  const conversation = messages.filter((m) => m.role !== "system");

  if (systemMessage) {
    conversation.unshift({ role: "user", content: systemMessage });
  }

  return {
    contents: conversation.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      temperature: responseType === "text" ? 0.7 : 0.2,
    },
  };
}

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

const TIMEOUT_MS = 30_000;

async function tryModel(
  model: string,
  apiKey: string,
  messages: ChatTurn[],
  responseType: "json" | "text" = "json"
): Promise<string> {
  const body = buildGeminiBody(messages, responseType);

  for (let attempt = 0; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response from Gemini.");
        return text;
      }

      if (res.status === 429 && attempt < 2) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      const text = await res.text();
      throw new Error(`Gemini request failed: ${res.status} ${text}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("Gemini request failed after retries.");
}

export async function callModel(messages: ChatTurn[], responseType: "json" | "text" = "json"): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to your .env.local file.");
  }

  const preferredModel = process.env.AI_MODEL;
  const modelsToTry = preferredModel
    ? [preferredModel, ...GEMINI_MODELS.filter((m) => m !== preferredModel)]
    : GEMINI_MODELS;

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      return await tryModel(model, apiKey, messages, responseType);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("All Gemini models exhausted.");
}

export function parseJsonResponse<T>(raw: string): T {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in response.");
  }
  return JSON.parse(raw.slice(start, end + 1)) as T;
}
