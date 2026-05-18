import { Router } from "express";
import { z } from "zod";
import type { Server } from "socket.io";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";
import { openCase } from "../services/caseOpening.js";

export function createCasesRouter(io: Server) {
  const router = Router();

  router.get("/", async (_req, res) => {
    const cases = await prisma.case.findMany({
      where: { isActive: true },
      include: { drops: { include: { item: true } } },
      orderBy: { sortOrder: "asc" }
    });
    res.json({ cases });
  });

  router.post("/:caseId/open", requireAuth, async (req, res) => {
    const schema = z.object({ clientSeed: z.string().min(8).max(128) });
    const { clientSeed } = schema.parse(req.body);
    const result = await openCase(res.locals.user.userId, req.params.caseId, clientSeed);

    io.to("live-feed").emit("case:opened", {
      userId: res.locals.user.userId,
      item: result.inventoryItem.item,
      fairRoundId: result.fairRoundId
    });

    res.json(result);
  });

  return router;
}
