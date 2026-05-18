import { prisma } from "../prisma.js";
import { createServerSeed, rollDrop } from "./provablyFair.js";

export async function openCase(userId: string, caseId: string, clientSeed: string) {
  return prisma.$transaction(async (tx) => {
    const caseRecord = await tx.case.findUnique({
      where: { id: caseId },
      include: { drops: { include: { item: true }, orderBy: { weight: "asc" } } }
    });
    if (!caseRecord || !caseRecord.isActive) throw new Error("case_not_found");

    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });
    if (Number(wallet.balance) < Number(caseRecord.price)) throw new Error("insufficient_balance");

    const serverSeed = createServerSeed();
    const round = await tx.fairRound.create({
      data: {
        userId,
        caseId,
        serverSeedHash: serverSeed.hash,
        serverSeed: serverSeed.seed,
        clientSeed,
        nonce: 1
      }
    });

    const totalWeight = caseRecord.drops.reduce((sum, drop) => sum + drop.weight, 0);
    const roll = rollDrop(serverSeed.seed, clientSeed, round.nonce, totalWeight);
    let cursor = 0;
    const selected = caseRecord.drops.find((drop) => {
      cursor += drop.weight;
      return roll < cursor;
    });
    if (!selected) throw new Error("drop_not_selected");

    await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: caseRecord.price } }
    });

    await tx.walletLedger.create({
      data: {
        userId,
        type: "CASE_OPEN",
        amount: -Number(caseRecord.price),
        currency: "USD",
        metadata: { caseId }
      }
    });

    const inventoryItem = await tx.inventoryItem.create({
      data: {
        userId,
        itemId: selected.itemId,
        source: "CASE",
        fairRoundId: round.id
      },
      include: { item: true }
    });

    return { inventoryItem, roll, fairRoundId: round.id };
  });
}
