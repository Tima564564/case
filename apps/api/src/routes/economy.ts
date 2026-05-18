import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";
import { calculateHouseEdgeFromRtp, calculateRtp, recommendDropRateAction } from "../services/economy.js";

export const economyRouter = Router();

economyRouter.get("/public", async (_req, res) => {
  const cases = await prisma.case.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, title: true, targetRtp: true, houseEdge: true, totalOpened: true, drops: { include: { item: true }, orderBy: { weight: "desc" } } },
    orderBy: { sortOrder: "asc" }
  });
  res.json({ cases });
});

economyRouter.get("/admin/dashboard", requireAuth, requireAdmin, async (_req, res) => {
  const cases = await prisma.case.findMany({
    select: { id: true, slug: true, title: true, targetRtp: true, houseEdge: true, totalOpened: true, totalRevenue: true, totalPayout: true, profit: true, dynamicDropRates: true },
    orderBy: { totalRevenue: "desc" }
  });
  const riskEvents = await prisma.riskEvent.findMany({ where: { resolved: false }, orderBy: { createdAt: "desc" }, take: 20 });
  const rows = cases.map((caseRecord) => {
    const actualRtp = calculateRtp(Number(caseRecord.totalRevenue), Number(caseRecord.totalPayout));
    const targetRtp = Number(caseRecord.targetRtp);
    return { ...caseRecord, actualRtp, recommendedAction: recommendDropRateAction(actualRtp, targetRtp), actualHouseEdge: calculateHouseEdgeFromRtp(actualRtp) };
  });
  res.json({ cases: rows, riskEvents });
});

economyRouter.post("/admin/cases/:id/rtp", requireAuth, requireAdmin, async (req, res) => {
  const targetRtp = Number(req.body.targetRtp);
  const houseEdge = calculateHouseEdgeFromRtp(targetRtp);
  const caseRecord = await prisma.case.update({ where: { id: req.params.id }, data: { targetRtp, houseEdge, profitabilityTarget: houseEdge, dynamicDropRates: Boolean(req.body.dynamicDropRates) } });
  await prisma.economySnapshot.create({ data: { caseId: caseRecord.id, caseSlug: caseRecord.slug, eventType: "DROP_RATE_CHANGE", targetRtp, houseEdge, metadata: { adminId: res.locals.user.userId } } });
  res.json({ case: caseRecord });
});

economyRouter.post("/admin/auto-balance", requireAuth, requireAdmin, async (_req, res) => {
  const cases = await prisma.case.findMany();
  const recommendations = cases.map((caseRecord) => {
    const actualRtp = calculateRtp(Number(caseRecord.totalRevenue), Number(caseRecord.totalPayout));
    return { caseId: caseRecord.id, slug: caseRecord.slug, action: recommendDropRateAction(actualRtp, Number(caseRecord.targetRtp)), actualRtp, targetRtp: Number(caseRecord.targetRtp) };
  });
  res.json({ recommendations });
});
