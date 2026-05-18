import { PrismaClient, Rarity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const items = await Promise.all([
    prisma.item.upsert({
      where: { sku: "flux-blade" },
      update: {},
      create: { sku: "flux-blade", name: "Flux Blade", rarity: Rarity.COMMON, value: 8, sellPrice: 6.4 }
    }),
    prisma.item.upsert({
      where: { sku: "cyber-ak" },
      update: {},
      create: { sku: "cyber-ak", name: "Cyber AK", rarity: Rarity.RARE, value: 34, sellPrice: 27.2 }
    }),
    prisma.item.upsert({
      where: { sku: "pulse-dragon" },
      update: {},
      create: { sku: "pulse-dragon", name: "Pulse Dragon", rarity: Rarity.EPIC, value: 145, sellPrice: 116 }
    }),
    prisma.item.upsert({
      where: { sku: "void-crown" },
      update: {},
      create: { sku: "void-crown", name: "Void Crown", rarity: Rarity.MYTHIC, value: 910, sellPrice: 728 }
    })
  ]);

  const caseRecord = await prisma.case.upsert({
    where: { slug: "neon-alpha" },
    update: {},
    create: {
      slug: "neon-alpha",
      title: "Neon Alpha",
      description: "Fast neon case for first-time drops.",
      price: 12.5,
      sortOrder: 1
    }
  });

  await prisma.caseDrop.deleteMany({ where: { caseId: caseRecord.id } });
  await prisma.caseDrop.createMany({
    data: [
      { caseId: caseRecord.id, itemId: items[0].id, weight: 7000 },
      { caseId: caseRecord.id, itemId: items[1].id, weight: 2400 },
      { caseId: caseRecord.id, itemId: items[2].id, weight: 560 },
      { caseId: caseRecord.id, itemId: items[3].id, weight: 40 }
    ]
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
