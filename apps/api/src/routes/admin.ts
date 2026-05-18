import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/analytics/revenue", async (_req, res) => {
  const ledger = await prisma.walletLedger.groupBy({
    by: ["type"],
    _sum: { amount: true }
  });
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
