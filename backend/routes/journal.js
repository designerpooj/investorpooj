import express from "express";
import { getEntries, addEntry, deleteEntry } from "../journalStore.js";
import { matchBrand, guessSentiment } from "../utils/matcher.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getEntries());
});

router.post("/", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Journal entry text is required" });
  }

  const matchedBrand = matchBrand(text);
  const sentiment = guessSentiment(text);

  const entry = addEntry({
    text: text.trim(),
    brand: matchedBrand ? matchedBrand.brand : null,
    company: matchedBrand ? matchedBrand.company : null,
    ticker: matchedBrand ? matchedBrand.ticker : null,
    isPublic: matchedBrand ? matchedBrand.isPublic : null,
    sentiment
  });

  res.status(201).json(entry);
});

router.delete("/:id", (req, res) => {
  deleteEntry(req.params.id);
  res.status(204).end();
});

export default router;
