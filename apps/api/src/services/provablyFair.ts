import crypto from "node:crypto";

export function createServerSeed() {
  const seed = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(seed).digest("hex");
  return { seed, hash };
}

export function rollDrop(serverSeed: string, clientSeed: string, nonce: number, totalWeight: number) {
  const digest = crypto
    .createHmac("sha256", serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest("hex");

  const int = Number.parseInt(digest.slice(0, 12), 16);
  return int % totalWeight;
}
