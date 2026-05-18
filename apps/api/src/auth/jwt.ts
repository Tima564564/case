import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { env } from "../env.js";

export type AuthUser = {
  userId: string;
  telegramId: string;
  role: "USER" | "ADMIN" | "RISK";
};

export function signSession(payload: AuthUser) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "missing_token" });

  try {
    res.locals.user = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    return next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (res.locals.user?.role !== "ADMIN") return res.status(403).json({ error: "admin_only" });
  return next();
}
