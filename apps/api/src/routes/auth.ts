import { Router } from "express";
import { z } from "zod";
import { env } from "../env.js";
import { prisma } from "../prisma.js";
import { signSession } from "../auth/jwt.js";
import { validateTelegramInitData } from "../auth/telegram.js";

export const authRouter = Router();

const TelegramLoginSchema = z.object({
  initData: z.string().min(1)
});

authRouter.post("/telegram", async (req, res) => {
  const { initData } = TelegramLoginSchema.parse(req.body);
  const telegramUser = validateTelegramInitData(initData, env.TELEGRAM_BOT_TOKEN);
  if (!telegramUser) return res.status(401).json({ error: "invalid_telegram_init_data" });

  const user = await prisma.user.upsert({
    where: { telegramId: telegramUser.id },
    update: {
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      avatarUrl: telegramUser.photo_url,
      lastLoginAt: new Date()
    },
    create: {
      telegramId: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      avatarUrl: telegramUser.photo_url,
      wallet: { create: { balance: 0, lockedBalance: 0 } }
    }
  });

  const token = signSession({ userId: user.id, telegramId: user.telegramId, role: user.role });
  return res.json({ token, user });
});
