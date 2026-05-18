import { Router } from "express";
import type { Server } from "socket.io";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";

export function createPvpRouter(io: Server) {
  const router = Router();

  router.use(requireAuth);

  router.get("/battles", async (_req, res) => {
    const battles = await prisma.battle.findMany({
      where: { status: { in: ["WAITING", "RUNNING"] } },
      include: { players: true, rounds: true },
      orderBy: { createdAt: "desc" },
      take: 25
    });
    res.json({ battles });
  });

  router.post("/battles", async (req, res) => {
    const battle = await prisma.battle.create({
      data: {
        creatorId: res.locals.user.userId,
        mode: req.body.mode ?? "ONE_VS_ONE",
        status: "WAITING",
        entryCaseIds: req.body.caseIds ?? [],
        players: { create: { userId: res.locals.user.userId, seat: 1 } }
      },
      include: { players: true }
    });

    io.emit("battle:created", battle);
    res.status(201).json({ battle });
  });

  router.post("/battles/:battleId/join", async (req, res) => {
    const battle = await prisma.battlePlayer.create({
      data: {
        battleId: req.params.battleId,
        userId: res.locals.user.userId,
        seat: req.body.seat ?? 2
      }
    });

    io.to(`battle:${req.params.battleId}`).emit("battle:joined", battle);
    res.json({ battlePlayer: battle });
  });

  return router;
}
