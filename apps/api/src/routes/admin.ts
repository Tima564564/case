import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/analytics/revenue", async (_req, res) => {
  const ledger = await prisma.walletLedger.groupBy({ by: ["type"], _sum: { amount: true } });
  res.json({ ledger });
});

adminRouter.post("/cases", async (req, res) => {
  const caseRecord = await prisma.case.create({ data: req.body });
  res.status(201).json({ case: caseRecord });
});

adminRouter.patch("/cases/:id", async (req, res) => {
  const caseRecord = await prisma.case.update({ where: { id: req.params.id }, data: req.body });
  res.json({ case: caseRecord });
});

adminRouter.get("/economy/risk", async (_req, res) => {
  const [riskEvents, pendingWithdrawals, largeWins] = await Promise.all([
    prisma.riskEvent.findMany({ where: { resolved: false }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.cryptoPayment.findMany({ where: { status: "PENDING", provider: { contains: "withdrawal" } }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.inventoryItem.findMany({ where: { item: { value: { gte: 100 } } }, include: { item: true, user: { select: { id: true, username: true, riskScore: true } } }, orderBy: { createdAt: "desc" }, take: 50 })
  ]);
  res.json({ riskEvents, pendingWithdrawals, largeWins });
});

adminRouter.post("/gift-items", async (req, res) => {
  const item = await prisma.item.create({ data: req.body });
  res.status(201).json({ item });
});

adminRouter.patch("/gift-items/:id", async (req, res) => {
  const item = await prisma.item.update({ where: { id: req.params.id }, data: req.body });
  res.json({ item });
});

adminRouter.post("/seasonal-events", async (req, res) => {
  const event = await prisma.seasonalEvent.create({ data: req.body });
  res.status(201).json({ event });
});
