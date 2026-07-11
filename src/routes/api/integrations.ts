import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getCurrentUser } from "~/lib/auth";
import { list as listConnectors } from "~/connectors";

/** GET /api/integrations — List the user's integrations */
export const APIRoute = createAPIFileRoute("/api/integrations")({
  GET: async ({ request }: { request: Request }) => {
    const user = await getCurrentUser(request);
    if (!user) {
      return json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      const db = (await import("~/db")).sql();
      const rows = await db`
        SELECT i.id, i.provider_id, i.label, i.enabled, i.created_at, i.last_sync_at,
               p.name as provider_name, p.description as provider_desc, p.icon_url
        FROM integrations i
        JOIN integration_providers p ON p.id = i.provider_id
        WHERE i.user_id = ${user.id}
        ORDER BY i.created_at DESC
      `;
      return json({
        integrations: rows.map((r: any) => ({
          id: String(r.id),
          providerId: String(r.provider_id),
          providerName: String(r.provider_name),
          providerDesc: String(r.provider_desc),
          label: r.label ? String(r.label) : null,
          enabled: Boolean(r.enabled),
          createdAt: String(r.created_at),
          lastSyncAt: r.last_sync_at ? String(r.last_sync_at) : null,
        })),
      });
    } catch (err: any) {
      if (err?.message?.includes("DATABASE_URL is not set")) {
        // Return empty list without error so the UI can still render
        return json({ integrations: [], dbStatus: "disconnected" });
      }
      console.error("List integrations error:", err);
      return json({ error: "Internal server error" }, { status: 500 });
    }
  },

  /** POST /api/integrations — Connect a new integration */
  POST: async ({ request }: { request: Request }) => {
    const user = await getCurrentUser(request);
    if (!user) {
      return json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      const body = (await request.json()) as {
        provider_id?: string;
        label?: string;
        config?: Record<string, string>;
      };
      const { provider_id, label, config } = body;

      if (!provider_id) {
        return json({ error: "provider_id is required" }, { status: 400 });
      }

      // Verify the connector exists
      const connectors = listConnectors();
      const connector = connectors.find((c) => c.id === provider_id);
      if (!connector) {
        return json(
          { error: `Unknown provider: ${provider_id}` },
          { status: 400 },
        );
      }

      const db = (await import("~/db")).sql();

      // Check if already connected
      const existing = await db`
        SELECT id FROM integrations
        WHERE user_id = ${user.id} AND provider_id = ${provider_id}
      `;
      if (existing.length > 0) {
        return json(
          { error: `${connector.name} is already connected` },
          { status: 409 },
        );
      }

      // Validate config
      if (config && !(await connector.validate(config))) {
        return json(
          { error: "Invalid connection configuration" },
          { status: 400 },
        );
      }

      const crypto = await import("node:crypto");
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      await db`
        INSERT INTO integrations (id, user_id, provider_id, label, config, enabled, created_at, updated_at)
        VALUES (${id}, ${user.id}, ${provider_id}, ${label ?? null}, ${JSON.stringify(config ?? {})}, true, ${now}, ${now})
      `;

      return json({
        integration: {
          id,
          providerId: provider_id,
          label: label ?? null,
          enabled: true,
          createdAt: now,
        },
      });
    } catch (err: any) {
      if (err?.message?.includes("DATABASE_URL is not set")) {
        return json(
          { error: "Database is not yet connected", dbStatus: "disconnected" },
          { status: 503 },
        );
      }
      console.error("Create integration error:", err);
      return json({ error: "Internal server error" }, { status: 500 });
    }
  },
});