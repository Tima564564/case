import { Router } from "express";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";

export const rewardsRouter = Router();

rewardsRouter.use(requireAuth);

rewardsRouter.get("/tasks", async (_req, res) => {
  const tasks = await prisma.task.findMany({
    where: { isActive: true },
    include: { progress: { where: { userId: res.locals.user.userId } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ tasks });
});

rewardsRouter.post("/daily/claim", async (_req, res) => {
  const dayKey = new Date().toISOString().slice(0, 10);
  const amount = 0.25;
  const existing = await prisma.dailyReward.findUnique({
    where: { userId_dayKey: { userId: res.locals.user.userId, dayKey } }
  });
  if (existing) return res.status(409).json({ error: "daily_reward_already_claimed" });

  const reward = await prisma.$transaction(async (tx) => {
    const claimed = await tx.dailyReward.create({
      data: {
        userId: res.locals.user.userId,
        dayKey,
        amount
      }
    });

    await tx.wallet.update({
      where: { userId: res.locals.user.userId },
      data: { balance: { increment: amount } }
    });

    await tx.walletLedger.create({
      data: {
        userId: res.locals.user.userId,
        type: "DAILY_BONUS",
        amount,
        currency: "USD",
        metadata: { dayKey }
      }
    });

    return claimed;
  });

  res.json({ reward });
});
