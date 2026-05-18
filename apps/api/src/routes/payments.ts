import crypto from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";

export const paymentsRouter = Router();
paymentsRouter.use(requireAuth);

paymentsRouter.get("/transactions", async (_req, res) => {
  const [ledger, cryptoPayments, starsPayments, tonWallets] = await Promise.all([
    prisma.walletLedger.findMany({ where: { userId: res.locals.user.userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.cryptoPayment.findMany({ where: { userId: res.locals.user.userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.starsPayment.findMany({ where: { userId: res.locals.user.userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.tonWallet.findMany({ where: { userId: res.locals.user.userId }, orderBy: { updatedAt: "desc" } })
  ]);
  res.json({ ledger, cryptoPayments, starsPayments, tonWallets });
});

paymentsRouter.post("/deposits", async (req, res) => {
  const schema = z.object({ chain: z.string().min(2), asset: z.string().min(2), amount: z.coerce.number().positive() });
  const body = schema.parse(req.body);
  const payment = await prisma.cryptoPayment.create({ data: { userId: res.locals.user.userId, provider: "manual-or-provider-adapter", chain: body.chain, asset: body.asset, amount: body.amount, address: crypto.randomBytes(20).toString("hex"), status: "PENDING" } });
  res.status(201).json({ payment });
});

paymentsRouter.post("/ton/wallets", async (req, res) => {
  const schema = z.object({ address: z.string().min(24), network: z.enum(["mainnet", "testnet"]).default("mainnet"), proof: z.record(z.unknown()).optional() });
  const body = schema.parse(req.body);
  const wallet = await prisma.tonWallet.upsert({ where: { userId_address: { userId: res.locals.user.userId, address: body.address } }, update: { status: "CONNECTED", proof: body.proof, lastUsedAt: new Date() }, create: { userId: res.locals.user.userId, address: body.address, network: body.network, proof: body.proof, lastUsedAt: new Date() } });
  res.json({ wallet });
});

paymentsRouter.post("/ton/deposits", async (req, res) => {
  const schema = z.object({ walletAddress: z.string().min(24), amountTon: z.coerce.number().positive(), txHash: z.string().min(12).optional() });
  const body = schema.parse(req.body);
  const payment = await prisma.cryptoPayment.create({ data: { userId: res.locals.user.userId, provider: "ton-connect", chain: "TON", asset: "TON", address: body.walletAddress, txHash: body.txHash, amount: body.amountTon, status: body.txHash ? "CONFIRMED" : "PENDING", metadata: { confirmation: "verify-on-chain-worker" } } });
  res.status(201).json({ payment });
});

paymentsRouter.post("/ton/withdrawals", async (req, res) => {
  const schema = z.object({ walletAddress: z.string().min(24), amountTon: z.coerce.number().positive() });
  const body = schema.parse(req.body);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: res.locals.user.userId }, include: { wallet: true } });
  const accountAgeHours = (Date.now() - user.createdAt.getTime()) / 3_600_000;
  if (accountAgeHours < 24) return res.status(423).json({ error: "withdrawal_cooldown" });
  const payment = await prisma.cryptoPayment.create({ data: { userId: user.id, provider: "ton-withdrawal-review", chain: "TON", asset: "TON", address: body.walletAddress, amount: body.amountTon, status: "PENDING", metadata: { cooldownPassed: true, review: "manual-or-risk-worker" } } });
  res.status(202).json({ payment });
});

paymentsRouter.get("/stars/packs", async (_req, res) => {
  res.json({ packs: [{ id: "stars_100", stars: 100, balance: 4.5, bonus: 0 }, { id: "stars_500", stars: 500, balance: 24, bonus: 2 }, { id: "stars_1500", stars: 1500, balance: 78, bonus: 10 }] });
});

paymentsRouter.post("/stars/invoices", async (req, res) => {
  const schema = z.object({ packId: z.string(), amountStars: z.coerce.number().int().positive(), balanceAmount: z.coerce.number().positive() });
  const body = schema.parse(req.body);
  const payload = `stars:${res.locals.user.userId}:${body.packId}:${crypto.randomUUID()}`;
  const payment = await prisma.starsPayment.create({ data: { userId: res.locals.user.userId, invoicePayload: payload, amountStars: body.amountStars, balanceAmount: body.balanceAmount, metadata: { currency: "XTR", botApiAction: "sendInvoice", note: "Telegram Stars invoices use currency XTR via Bot Payments." } } });
  res.status(201).json({ payment, invoicePayload: payload });
});

paymentsRouter.post("/stars/confirm", async (req, res) => {
  const schema = z.object({ invoicePayload: z.string(), telegramPaymentChargeId: z.string() });
  const body = schema.parse(req.body);
  const payment = await prisma.$transaction(async (tx) => {
    const starsPayment = await tx.starsPayment.update({ where: { invoicePayload: body.invoicePayload }, data: { telegramPaymentChargeId: body.telegramPaymentChargeId, status: "CONFIRMED" } });
    await tx.wallet.update({ where: { userId: starsPayment.userId }, data: { balance: { increment: starsPayment.balanceAmount } } });
    await tx.walletLedger.create({ data: { userId: starsPayment.userId, type: "DEPOSIT", amount: starsPayment.balanceAmount, currency: "XTR", externalId: body.telegramPaymentChargeId, metadata: { stars: starsPayment.amountStars } } });
    return starsPayment;
  });
  res.json({ payment });
});

paymentsRouter.post("/withdrawals", async (req, res) => {
  const schema = z.object({ chain: z.string().min(2), asset: z.string().min(2), address: z.string().min(12), amount: z.coerce.number().positive() });
  const body = schema.parse(req.body);
  const payment = await prisma.cryptoPayment.create({ data: { userId: res.locals.user.userId, provider: "manual-review", chain: body.chain, asset: body.asset, address: body.address, amount: body.amount, status: "PENDING", metadata: { direction: "withdrawal" } } });
  res.status(202).json({ payment });
});
