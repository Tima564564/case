import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";
import { createServerSeed, rollDrop } from "../services/provablyFair.js";

export const inventoryRouter = Router();

inventoryRouter.use(requireAuth);

inventoryRouter.get("/", async (_req, res) => {
  const items = await prisma.inventoryItem.findMany({
    where: { userId: res.locals.user.userId, status: "OWNED" },
    include: { item: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ items });
});

inventoryRouter.post("/:id/sell", async (req, res) => {
  const result = await prisma.$transaction(async (tx) => {
    const inventoryItem = await tx.inventoryItem.findFirstOrThrow({
      where: { id: req.params.id, userId: res.locals.user.userId, status: "OWNED" },
      include: { item: true }
    });

    await tx.inventoryItem.update({ where: { id: inventoryItem.id }, data: { status: "SOLD" } });
    await tx.wallet.update({
      where: { userId: res.locals.user.userId },
      data: { balance: { increment: inventoryItem.item.sellPrice } }
    });
    await tx.walletLedger.create({
      data: {
        userId: res.locals.user.userId,
        type: "ITEM_SELL",
        amount: inventoryItem.item.sellPrice,
        currency: "USD",
        metadata: { inventoryItemId: inventoryItem.id }
      }
    });

    return inventoryItem;
  });

  res.json({ sold: result });
});

inventoryRouter.post("/:id/upgrade", async (req, res) => {
  const schema = z.object({ targetItemId: z.string(), clientSeed: z.string().min(8) });
  const { targetItemId, clientSeed } = schema.parse(req.body);

  const result = await prisma.$transaction(async (tx) => {
    const inventoryItem = await tx.inventoryItem.findFirstOrThrow({
      where: { id: req.params.id, userId: res.locals.user.userId, status: "OWNED" },
      include: { item: true }
    });
    const target = await tx.item.findUniqueOrThrow({ where: { id: targetItemId } });

    const successChance = Math.min(0.75, Number(inventoryItem.item.value) / Number(target.value));
    const serverSeed = createServerSeed();
    const fairRound = await tx.fairRound.create({
      data: {
        userId: res.locals.user.userId,
        serverSeedHash: serverSeed.hash,
        serverSeed: serverSeed.seed,
        clientSeed,
        nonce: 1
      }
    });

    const roll = rollDrop(serverSeed.seed, clientSeed, 1, 1_000_000);
    const success = roll < Math.floor(successChance * 1_000_000);

    await tx.inventoryItem.update({
      where: { id: inventoryItem.id },
      data: { status: "UPGRADED" }
    });

    const wonItem = success
      ? await tx.inventoryItem.create({
          data: {
            userId: res.locals.user.userId,
            itemId: targetItemId,
            source: "UPGRADE",
            fairRoundId: fairRound.id
          },
          include: { item: true }
        })
      : null;

    const upgrade = await tx.upgradeAttempt.create({
      data: {
        userId: res.locals.user.userId,
        sourceInventoryItemId: inventoryItem.id,
        targetItemId,
        successChance,
        success,
        fairRoundId: fairRound.id
      }
    });

    return { upgrade, success, target, wonItem, roll, fairRoundId: fairRound.id };
  });

  res.json(result);
});
