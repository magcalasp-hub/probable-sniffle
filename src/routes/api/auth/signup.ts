import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { sql } from "~/db";
import { hashPassword, generateId, createSessionCookie } from "~/lib/auth";

export const APIRoute = createAPIFileRoute("/api/auth/signup")({
  POST: async ({ request }: { request: Request }) => {
    try {
      const body = (await request.json()) as {
        name?: string;
        email?: string;
        password?: string;
      };
      const { name, email, password } = body;

      if (!email || !password) {
        return json({ error: "Email and password are required" }, { status: 400 });
      }

      if (password.length < 8) {
        return json(
          { error: "Password must be at least 8 characters" },
          { status: 400 },
        );
      }

      const db = sql();

      // Check if user already exists
      const existing = await db`SELECT id FROM users WHERE email = ${email}`;
      if (existing.length > 0) {
        return json(
          { error: "An account with this email already exists" },
          { status: 409 },
        );
      }

      // Create user
      const passwordHash = await hashPassword(password);
      const userId = generateId();

      await db`
        INSERT INTO users (id, email, password_hash, name)
        VALUES (${userId}, ${email}, ${passwordHash}, ${name ?? null})
      `;

      // Create session
      const sessionId = generateId();
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      await db`
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (${sessionId}, ${userId}, ${expiresAt})
      `;

      const cookie = createSessionCookie(sessionId);

      return new Response(
        JSON.stringify({ user: { id: userId, email, name: name ?? null, plan: "starter" } }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": cookie,
          },
        },
      );
    } catch (err: any) {
      if (err?.message?.includes("DATABASE_URL is not set")) {
        return json(
          { error: "Database is not yet connected. Please set up your Neon database." },
          { status: 503 },
        );
      }
      console.error("Signup error:", err);
      return json({ error: "Internal server error" }, { status: 500 });
    }
  },
});