import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../auth/jwt.js";
import { prisma } from "../prisma.js";

export const marketplaceRouter = Router();

marketplaceRouter.get("/listings", async (_req, res) => {
  const listings = await prisma.giftListing.findMany({ where: { status: "ACTIVE" }, include: { item: true, seller: { select: { id: true, username: true, vipTier: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
  res.json({ listings });
});

marketplaceRouter.post("/listings", requireAuth, async (req, res) => {
  const schema = z.object({ inventoryItemId: z.string(), price: z.coerce.number().positive(), currency: z.enum(["USD", "TON", "XTR"]).default("USD") });
  const body = schema.parse(req.body);
  const listing = await prisma.$transaction(async (tx) => {
    const inventoryItem = await tx.inventoryItem.findFirstOrThrow({ where: { id: body.inventoryItemId, userId: res.locals.user.userId, status: "OWNED" } });
    return tx.giftListing.create({ data: { sellerId: res.locals.user.userId, inventoryItemId: inventoryItem.id, itemId: inventoryItem.itemId, price: body.price, currency: body.currency }, include: { item: true } });
  });
  res.status(201).json({ listing });
});

marketplaceRouter.post("/listings/:id/buy", requireAuth, async (req, res) => {
  const listing = await prisma.$transaction(async (tx) => {
    const activeListing = await tx.giftListing.findFirstOrThrow({ where: { id: req.params.id, status: "ACTIVE" }, include: { inventoryItem: true } });
    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId: res.locals.user.userId } });
    if (Number(wallet.balance) < Number(activeListing.price)) throw new Error("insufficient_balance");
    await tx.wallet.update({ where: { userId: res.locals.user.userId }, data: { balance: { decrement: activeListing.price } } });
    await tx.wallet.update({ where: { userId: activeListing.sellerId }, data: { balance: { increment: Number(activeListing.price) * 0.95 } } });
    await tx.inventoryItem.update({ where: { id: activeListing.inventoryItemId }, data: { userId: res.locals.user.userId } });
    return tx.giftListing.update({ where: { id: activeListing.id }, data: { status: "SOLD", buyerId: res.locals.user.userId, soldAt: new Date() }, include: { item: true } });
  });
  res.json({ listing });
});
