import Fuse from "fuse.js";
import brands from "../data/brands.js";

// Build a flat list of every brand name + alias, longest string first.
// Checking longest-first means "stanley cup" matches before a shorter
// generic word could accidentally match instead.
const nameEntries = brands
  .flatMap((b) => [b.brand, ...b.aliases].map((name) => ({ name, brand: b })))
  .sort((a, b) => b.name.length - a.name.length);

// Fuse is used only as a fallback for typo tolerance, matching individual
// words from the input against known brand names - not the whole sentence
// against a short name, which is what whole-string fuzzy matching does badly.
const fuse = new Fuse(
  nameEntries.map((e) => e.name),
  { includeScore: true, threshold: 0.3 }
);

export function matchBrand(text) {
  const lower = text.toLowerCase();

  // 1. Direct substring match on brand name/alias, word-boundary aware.
  for (const entry of nameEntries) {
    const escaped = entry.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escaped}\\b`, "i");
    if (pattern.test(lower)) {
      return entry.brand;
    }
  }

  // 2. Fallback: fuzzy-match each word in the text against known brand names,
  // to catch typos like "Stanly" or "Lulu Lemon".
  const words = lower.split(/\s+/).filter((w) => w.length > 2);
  for (const word of words) {
    const results = fuse.search(word);
    if (results.length > 0 && results[0].score < 0.3) {
      const matchedName = results[0].item;
      const entry = nameEntries.find((e) => e.name === matchedName);
      if (entry) return entry.brand;
    }
  }

  return null;
}

// Simple keyword heuristic for sentiment.
// This is intentionally lightweight - it's meant to give a fast, soft suggestion
// the user can correct, not a definitive classification.
const POSITIVE_SIGNALS = [
  "sold out", "obsessed", "everyone", "line out the door", "can't keep",
  "flying off", "loved it", "amazing", "love", "great", "best", "favorite",
  "switched to", "recommend", "impressed", "sold-out"
];

const NEGATIVE_SIGNALS = [
  "returned", "disappointed", "meh", "worse", "hate", "terrible", "bad",
  "stopped buying", "quality dropped", "overpriced", "downgrade", "broke"
];

export function guessSentiment(text) {
  const lower = text.toLowerCase();
  const positiveHits = POSITIVE_SIGNALS.filter((phrase) => lower.includes(phrase)).length;
  const negativeHits = NEGATIVE_SIGNALS.filter((phrase) => lower.includes(phrase)).length;

  if (positiveHits === 0 && negativeHits === 0) return "neutral";
  if (positiveHits > negativeHits) return "positive";
  if (negativeHits > positiveHits) return "negative";
  return "neutral";
}
