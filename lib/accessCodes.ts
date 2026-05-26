import { randomBytes } from "node:crypto";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateAccessCode() {
  const bytes = randomBytes(9);
  const chars = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]);

  return `${chars.slice(0, 3).join("")}-${chars.slice(3, 6).join("")}-${chars
    .slice(6, 9)
    .join("")}`;
}

export function normalizeAccessCode(code: string) {
  return code.trim().toUpperCase();
}

export function isExpired(expiresAt: string | null) {
  return Boolean(expiresAt && new Date(expiresAt).getTime() < Date.now());
}
