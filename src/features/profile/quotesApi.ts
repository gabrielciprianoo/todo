import quotes from "./data/quotes.json";
import type { ProgressBucket } from "./types";

const FALLBACK_QUOTE = "Keep going — you're doing great.";

const BUCKET_KEY: Record<ProgressBucket, keyof typeof quotes> = {
  empty: "empty",
  "in-progress": "inProgress",
  complete: "complete",
};

/**
 * Simulates an async API call: reads the local quotes list, picks a random
 * quote from the bucket, resolves a Promise. Swappable for a real fetch()
 * later without changing call sites. Always resolves, never rejects.
 */
export function fetchQuoteOfTheDay(bucket: ProgressBucket): Promise<string> {
  const list = quotes[BUCKET_KEY[bucket]];
  const quote = list.length
    ? list[Math.floor(Math.random() * list.length)]
    : FALLBACK_QUOTE;
  return Promise.resolve(quote);
}
