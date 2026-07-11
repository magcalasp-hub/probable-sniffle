import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { sql } from "~/db";
import { verifyPassword, generateId, createSessionCookie } from "~/lib/auth";

export const APIRoute = createAPIFileRoute("/api/auth/login")({
  POST: async ({ request }: { request: Request }) => {
    try {
      const body = (await request.json()) as {
        email?: string;
        password?: string;
      };
      const { email, password } = body;

      if (!email || !password) {
        return json(
          { error: "Email and password are required" },
          { status: 400 },
        );
      }

      const db = sql();

      // Find user
      const users = await db`
        SELECT id, email, password_hash, name, plan
        FROM users
        WHERE email = ${email}
      `;

      if (users.length === 0) {
        return json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      const user = users[0] as {
        id: string;
        email: string;
        password_hash: string;
        name: string | null;
        plan: string;
      };

      // Verify password
      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        return json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      // Create session
      const sessionId = generateId();
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      await db`
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (${sessionId}, ${user.id}, ${expiresAt})
      `;

      const cookie = createSessionCookie(sessionId);

      return new Response(
        JSON.stringify({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
          },
        }),
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
      console.error("Login error:", err);
      return json({ error: "Internal server error" }, { status: 500 });
    }
  },
});