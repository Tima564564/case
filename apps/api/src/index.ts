import http from "node:http";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./env.js";
import { createRealtimeServer } from "./realtime.js";
import { authRouter } from "./routes/auth.js";
import { createCasesRouter } from "./routes/cases.js";
import { inventoryRouter } from "./routes/inventory.js";
import { createPvpRouter } from "./routes/pvp.js";
import { adminRouter } from "./routes/admin.js";
import { rewardsRouter } from "./routes/rewards.js";
import { referralsRouter } from "./routes/referrals.js";
import { leaderboardRouter } from "./routes/leaderboard.js";
import { paymentsRouter } from "./routes/payments.js";

const app = express();
const server = http.createServer(app);
const io = createRealtimeServer(server);

app.use(helmet());
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/cases", createCasesRouter(io));
app.use("/inventory", inventoryRouter);
app.use("/pvp", createPvpRouter(io));
app.use("/rewards", rewardsRouter);
app.use("/referrals", referralsRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/payments", paymentsRouter);
app.use("/admin", adminRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : "internal_error";
  const status = message.includes("not_found") ? 404 : message.includes("insufficient") ? 402 : 500;
  res.status(status).json({ error: message });
});

const port = Number(process.env.PORT ?? env.API_PORT);

server.listen(port, () => {
  console.log(`API listening on :${port}`);
});
