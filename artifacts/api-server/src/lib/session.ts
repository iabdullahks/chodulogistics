import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/** Generates a random opaque session token (sent to the client as a cookie). */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hashes a session token before storing it in the database, so a DB leak
 * alone doesn't hand out valid session cookies. Uses SESSION_SECRET as an
 * HMAC key.
 */
export function hashSessionToken(token: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be set to hash session tokens.");
  }
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}
