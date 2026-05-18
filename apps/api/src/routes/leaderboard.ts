import { Router } from "express";
import { prisma } from "../prisma.js";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", async (_req, res) => {
  const leaders = await prisma.wallet.findMany({
    orderBy: { balance: "desc" },
    take: 50,
    include: {
      user: {
        select: { id: true, username: true, avatarUrl: true }
      }
    }
  });

  res.json({ leaders });
});
