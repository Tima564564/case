import { Router } from "express";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";
import { env } from "../env.js";

export const referralsRouter = Router();

referralsRouter.use(requireAuth);

referralsRouter.get("/", async (_req, res) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: res.locals.user.userId },
    select: {
      referralCode: true,
      referrals: {
        select: { id: true, username: true, createdAt: true }
      }
    }
  });

  res.json({
    code: user.referralCode,
    inviteUrl: `https://t.me/${env.TELEGRAM_BOT_USERNAME}/app?startapp=${user.referralCode}`,
    referrals: user.referrals
  });
});
