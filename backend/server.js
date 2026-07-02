// Sentry must be imported first, before any other imports, per Sentry's setup docs.
import "./instrument.js";
import Sentry from "./instrument.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import finnhubRoutes from "./routes/finnhub.js";
import trendsRoutes from "./routes/trends.js";
import journalRoutes from "./routes/journal.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/finnhub", finnhubRoutes);
app.use("/api/trends", trendsRoutes);
app.use("/api/journal", journalRoutes);

// A deliberate error endpoint, purely so you can confirm Sentry is wired up
// correctly before you start building. Hit GET /api/debug-sentry and check
// your Sentry project's Issues tab for it to show up.
app.get("/api/debug-sentry", () => {
  throw new Error("Test error - Sentry backend instrumentation check");
});

// Sentry's error handler must be registered after all routes, before any
// other error middleware you add.
Sentry.setupExpressErrorHandler(app);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
