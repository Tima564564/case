import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";
import { createServerSeed, rollDrop } from "../services/provablyFair.js";

export const giftsRouter = Router();
giftsRouter.use(requireAuth);

giftsRouter.get("/inventory", async (_req, res) => {
  const items = await prisma.inventoryItem.findMany({ where: { userId: res.locals.user.userId, status: "OWNED" }, include: { item: true, listings: { where: { status: "ACTIVE" } } }, orderBy: { createdAt: "desc" } });
  res.json({ items });
});

giftsRouter.post("/transfer", async (req, res) => {
  const schema = z.object({ inventoryItemId: z.string(), receiverTelegramId: z.string().min(3), message: z.string().max(160).optional() });
  const body = schema.parse(req.body);
  const transfer = await prisma.$transaction(async (tx) => {
    const inventoryItem = await tx.inventoryItem.findFirstOrThrow({ where: { id: body.inventoryItemId, userId: res.locals.user.userId, status: "OWNED" } });
    await tx.inventoryItem.update({ where: { id: inventoryItem.id }, data: { status: "BATTLE_LOCKED", lockedUntil: new Date(Date.now() + 30 * 60_000) } });
    return tx.giftTransfer.create({ data: { senderId: res.locals.user.userId, receiverTelegramId: body.receiverTelegramId, inventoryItemId: inventoryItem.id, message: body.message } });
  });
  res.status(201).json({ transfer });
});

giftsRouter.post("/fusion", async (req, res) => {
  const schema = z.object({ inventoryItemIds: z.array(z.string()).min(2).max(5), targetItemId: z.string().optional(), clientSeed: z.string().min(8) });
  const body = schema.parse(req.body);
  const result = await prisma.$transaction(async (tx) => {
    const sourceItems = await tx.inventoryItem.findMany({ where: { id: { in: body.inventoryItemIds }, userId: res.locals.user.userId, status: "OWNED" }, include: { item: true } });
    if (sourceItems.length !== body.inventoryItemIds.length) throw new Error("invalid_fusion_items");
    const totalValue = sourceItems.reduce((sum, item) => sum + Number(item.item.value), 0);
    const target = body.targetItemId ? await tx.item.findUnique({ where: { id: body.targetItemId } }) : null;
    const targetValue = target ? Number(target.value) : totalValue * 1.65;
    const successChance = Math.min(0.7, totalValue / targetValue);
    const serverSeed = createServerSeed();
    const fairRound = await tx.fairRound.create({ data: { userId: res.locals.user.userId, serverSeedHash: serverSeed.hash, serverSeed: serverSeed.seed, clientSeed: body.clientSeed, nonce: 1 } });
    const roll = rollDrop(serverSeed.seed, body.clientSeed, 1, 1_000_000);
    const success = roll < Math.floor(successChance * 1_000_000);
    await tx.inventoryItem.updateMany({ where: { id: { in: body.inventoryItemIds }, userId: res.locals.user.userId }, data: { status: "UPGRADED" } });
    const fusion = await tx.fusionAttempt.create({ data: { userId: res.locals.user.userId, sourceInventoryItemIds: body.inventoryItemIds, targetItemId: target?.id, successChance, success, fairRoundId: fairRound.id, metadata: { roll } } });
    const wonItem = success && target ? await tx.inventoryItem.create({ data: { userId: res.locals.user.userId, itemId: target.id, source: "FUSION", fairRoundId: fairRound.id }, include: { item: true } }) : null;
    return { fusion, wonItem, roll };
  });
  res.json(result);
});
