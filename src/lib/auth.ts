/**
 * Auth utilities for Nexus.
 * Uses Bun.password for hashing and HTTP-only cookies for sessions.
 */
import { sql } from "~/db";

const SESSION_COOKIE = "nexus_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ---- Simple cookie helpers (no external deps) ----

function parseCookies(header: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (name) cookies[name] = decodeURIComponent(value);
  }
  return cookies;
}

function serializeCookie(
  name: string,
  value: string,
  opts: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    path?: string;
    maxAge?: number;
  },
): string {
  let parts = [`${name}=${encodeURIComponent(value)}`];
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  if (opts.path) parts.push(`Path=${opts.path}`);
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`);
  return parts.join("; ");
}

// ---- ID generation ----

export function generateId(): string {
  return crypto.randomUUID();
}

// ---- Password hashing (uses Bun's built-in bcrypt) ----

export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}

// ---- Session cookie management ----

export function createSessionCookie(sessionId: string): string {
  return serializeCookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function createClearSessionCookie(): string {
  return serializeCookie(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionCookie(
  request: Request,
): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const cookies = parseCookies(cookieHeader);
  return cookies[SESSION_COOKIE] ?? null;
}

// ---- Server-side session helpers ----

export type User = {
  id: string;
  email: string;
  name: string | null;
  plan: string;
};

/**
 * Get the current user from the session cookie.
 * Returns null if not authenticated or DB unavailable.
 */
export async function getCurrentUser(
  request: Request,
): Promise<User | null> {
  const sessionId = getSessionCookie(request);
  if (!sessionId) return null;

  try {
    const db = sql();
    const rows = await db`
      SELECT u.id, u.email, u.name, u.plan
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ${sessionId}
        AND s.expires_at > NOW()
    `;
    if (rows.length === 0) return null;
    const row = rows[0] as User;
    return {
      id: String(row.id),
      email: String(row.email),
      name: row.name ? String(row.name) : null,
      plan: String(row.plan),
    };
  } catch {
    // DB not connected yet — return null gracefully
    return null;
  }
}

/**
 * Require the current user — throws a redirect Response to /login if not authenticated.
 */
export async function requireUser(
  request: Request,
): Promise<User> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }
  return user;
}