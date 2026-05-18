import crypto from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";

export const paymentsRouter = Router();

paymentsRouter.use(requireAuth);

paymentsRouter.post("/deposits", async (req, res) => {
  const schema = z.object({
    chain: z.string().min(2),
    asset: z.string().min(2),
    amount: z.coerce.number().positive()
  });
  const body = schema.parse(req.body);

  const payment = await prisma.cryptoPayment.create({
    data: {
      userId: res.locals.user.userId,
      provider: "manual-or-provider-adapter",
      chain: body.chain,
      asset: body.asset,
      amount: body.amount,
      address: crypto.randomBytes(20).toString("hex"),
      status: "PENDING"
    }
  });

  res.status(201).json({ payment });
});

paymentsRouter.post("/withdrawals", async (req, res) => {
  const schema = z.object({
    chain: z.string().min(2),
    asset: z.string().min(2),
    address: z.string().min(12),
    amount: z.coerce.number().positive()
  });
  const body = schema.parse(req.body);

  const payment = await prisma.cryptoPayment.create({
    data: {
      userId: res.locals.user.userId,
      provider: "manual-review",
      chain: body.chain,
      asset: body.asset,
      address: body.address,
      amount: body.amount,
      status: "PENDING",
      metadata: { direction: "withdrawal" }
    }
  });

  res.status(202).json({ payment });
});
