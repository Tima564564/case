import crypto from "node:crypto";

export type TelegramAuthPayload = {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

export function validateTelegramInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculated = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  const calculatedBuffer = Buffer.from(calculated);
  const hashBuffer = Buffer.from(hash);
  if (calculatedBuffer.length !== hashBuffer.length) return null;

  const valid = crypto.timingSafeEqual(calculatedBuffer, hashBuffer);
  if (!valid) return null;

  const user = params.get("user");
  if (!user) return null;
  return JSON.parse(user) as TelegramAuthPayload;
}
