import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { getConfig } from "./config";
import { createRouter } from "./routes";
import { logger } from "./middleware/logger";
import { demoMiddleware } from "./middleware/demo";
import { errorHandler } from "./middleware/errorHandler";

const config = getConfig();
const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"]
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(logger);
app.use(demoMiddleware);

app.use(createRouter());

// Error handler must be registered last.
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[BFF] Express server listening on http://localhost:${config.port}`);
});
