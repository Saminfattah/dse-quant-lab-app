export const PAPER_MODE_WARNING =
  "Paper Mode only. This dashboard does not execute broker orders and is not financial advice.";

export function signalTone(signal: string): "positive" | "neutral" | "negative" | "warning" {
  const normalized = signal.toUpperCase();
  if (normalized.includes("BUY WATCH")) return "positive";
  if (normalized.includes("SELL")) return "negative";
  if (normalized.includes("AVOID")) return "warning";
  return "neutral";
}

