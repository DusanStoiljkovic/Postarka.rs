import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "postarka_admin";

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? "dev-secret-change-me";
}

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD ?? "postarka2026";
  return createHmac("sha256", secret()).update(password).digest("hex");
}

export function checkAdminPassword(password: string) {
  return password === (process.env.ADMIN_PASSWORD ?? "postarka2026");
}

export function adminSessionCookieName() {
  return COOKIE_NAME;
}

export function adminSessionToken() {
  return expectedToken();
}

export function isValidAdminSession(token: string | undefined) {
  if (!token) return false;
  const expected = expectedToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
