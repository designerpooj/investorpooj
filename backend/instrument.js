// This file must be imported at the very top of server.js, before any other imports.
// That's a Sentry requirement so it can instrument other libraries as they load.
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND || "", // paste your backend project DSN here or in .env
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0, // capture 100% of transactions in dev; lower this in production
  sendDefaultPii: false,
});

export default Sentry;
