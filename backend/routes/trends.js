import express from "express";

const router = express.Router();

// TODO: replace with a real integration. Google Trends has no official public API;
// the common approach is a small Python microservice using the `pytrends` package
// (unofficial, scrapes trends.google.com) that this Node backend calls over HTTP.
// For now this returns believable mock data so the rest of the app can be built
// and tested end-to-end without that extra service.
router.get("/interest/:brand", (req, res) => {
  const { brand } = req.params;

  // Deterministic-ish fake trend so the same brand always looks the same in dev
  const seed = brand.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const change = ((seed % 40) - 15); // roughly -15 to +25

  res.json({
    brand,
    changePercent: change,
    label: change > 5 ? "Trending up" : change < -5 ? "Trending down" : "Steady",
    mocked: true
  });
});

export default router;
