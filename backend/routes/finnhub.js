import express from "express";

const router = express.Router();
const FINNHUB_BASE = "https://finnhub.io/api/v1";
const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

// Small in-memory cache to avoid hammering the free-tier rate limit
// while you're actively developing (60 calls/min on Finnhub's free plan).
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

async function cachedFetch(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.data;
  }
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`Finnhub request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  cache.set(url, { data, time: Date.now() });
  return data;
}

router.get("/quote/:ticker", async (req, res) => {
  if (!FINNHUB_KEY) {
    return res.status(500).json({ error: "FINNHUB_API_KEY is not set on the server" });
  }
  try {
    const { ticker } = req.params;
    const url = `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(ticker)}&token=${FINNHUB_KEY}`;
    const data = await cachedFetch(url);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: "Failed to fetch quote", detail: err.message });
  }
});

router.get("/profile/:ticker", async (req, res) => {
  if (!FINNHUB_KEY) {
    return res.status(500).json({ error: "FINNHUB_API_KEY is not set on the server" });
  }
  try {
    const { ticker } = req.params;
    const url = `${FINNHUB_BASE}/stock/profile2?symbol=${encodeURIComponent(ticker)}&token=${FINNHUB_KEY}`;
    const data = await cachedFetch(url);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: "Failed to fetch company profile", detail: err.message });
  }
});

router.get("/news/:ticker", async (req, res) => {
  if (!FINNHUB_KEY) {
    return res.status(500).json({ error: "FINNHUB_API_KEY is not set on the server" });
  }
  try {
    const { ticker } = req.params;
    const to = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const url = `${FINNHUB_BASE}/company-news?symbol=${encodeURIComponent(ticker)}&from=${from}&to=${to}&token=${FINNHUB_KEY}`;
    const data = await cachedFetch(url);
    res.json(data.slice(0, 5)); // just the 5 most recent
  } catch (err) {
    res.status(err.status || 500).json({ error: "Failed to fetch company news", detail: err.message });
  }
});

export default router;
