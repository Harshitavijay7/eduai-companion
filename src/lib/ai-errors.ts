import axios from "axios";

/** Turns backend/network failures into a short, student-friendly message. */
export function friendlyAIError(err: unknown): string {
  let raw = "";
  let status = 0;
  if (axios.isAxiosError(err)) {
    status = err.response?.status ?? 0;
    const data = err.response?.data as { error?: unknown; message?: unknown } | undefined;
    raw = String(data?.error ?? data?.message ?? err.message ?? "");
    if (!err.response) return "Couldn't reach the study server. Check your connection and try again.";
  } else if (err instanceof Error) {
    raw = err.message;
  }
  const text = raw.toLowerCase();
  if (status === 503 || text.includes("503") || text.includes("unavailable") || text.includes("high demand"))
    return "AI is temporarily busy. Please try again.";
  if (status === 429 || text.includes("429") || text.includes("rate") || text.includes("quota"))
    return "Too many requests right now. Please wait a moment and try again.";
  if (text.includes("permission") || text.includes("not exist") || text.includes("403") || text.includes("404"))
    return "This PDF has expired on the AI server. Please upload it again.";
  if (text.includes("filename")) return "This PDF isn't ready for AI features. Please upload it again.";
  return "Something went wrong while generating. Please try again.";
}

/** Finds the first array in a response (top-level array or any array property). */
export function pickArray(data: unknown, keys: string[]): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of keys) {
      const v = o[k];
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v.replace(/^```(?:json)?\s*|\s*```$/g, ""));
          const arr = pickArray(parsed, keys);
          if (arr.length) return arr;
        } catch {
          /* ignore */
        }
      }
    }
    for (const v of Object.values(o)) if (Array.isArray(v)) return v;
  }
  return [];
}
