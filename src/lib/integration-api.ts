/**
 * Server functions for integration management.
 * These are callable directly from client components.
 */
import { createServerFn } from "@tanstack/react-start";
import { get, list } from "~/connectors";
import type { Connector } from "~/connectors";

// ---- Public connector info (no auth needed, no DB needed) ----

export interface ConnectorInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  authType: string;
  configFields: { key: string; label: string; type: string; required?: boolean; placeholder?: string }[];
  operations: { id: string; name: string; description: string }[];
}

export interface IntegrationInfo {
  id: string;
  providerId: string;
  providerName: string;
  providerDesc: string;
  label: string | null;
  enabled: boolean;
  createdAt: string;
  lastSyncAt: string | null;
}

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  dbStatus?: string;
}

/** Get all available connectors with their info */
export const getConnectors = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConnectorInfo[]> => {
    const connectors = list();
    return connectors.map((c: Connector) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon,
      authType: c.authType,
      configFields: c.configFields.map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type,
        required: f.required,
        placeholder: f.placeholder,
      })),
      operations: c.operations.map((op) => ({
        id: op.id,
        name: op.name,
        description: op.description,
      })),
    }));
  },
);

/** Create a new integration connection */
export const createIntegration = createServerFn({ method: "POST" }).handler(
  async (payload: {
    providerId: string;
    label?: string;
    config?: Record<string, string>;
    sessionId?: string;
  }): Promise<ApiResult<{ integration: IntegrationInfo }>> => {
    const { providerId, label, config } = payload;

    // Check connector exists
    const connector = get(providerId);
    if (!connector) {
      return { ok: false, error: `Unknown provider: ${providerId}` };
    }

    try {
      const db = (await import("~/db")).sql();

      // For now, simulate inserting without full auth flow
      // In real use, this would validate the session
      const crypto = await import("node:crypto");
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      // Validate config if provided
      if (config && !(await connector.validate(config))) {
        return { ok: false, error: "Invalid configuration" };
      }

      return {
        ok: true,
        data: {
          integration: {
            id,
            providerId,
            providerName: connector.name,
            providerDesc: connector.description,
            label: label ?? null,
            enabled: true,
            createdAt: now,
            lastSyncAt: null,
          },
        },
      };
    } catch (err: any) {
      if (err?.message?.includes("DATABASE_URL is not set")) {
        return {
          ok: true,
          data: {
            integration: {
              id: crypto.randomUUID(),
              providerId,
              providerName: connector.name,
              providerDesc: connector.description,
              label: label ?? null,
              enabled: true,
              createdAt: new Date().toISOString(),
              lastSyncAt: null,
            },
          },
          dbStatus: "disconnected",
        };
      }
      return { ok: false, error: "Internal server error" };
    }
  },
);

/** List user's integrations */
export const listIntegrations = createServerFn({ method: "GET" }).handler(
  async (): Promise<ApiResult<{ integrations: IntegrationInfo[] }>> => {
    try {
      const db = (await import("~/db")).sql();
      const rows = await db`
        SELECT i.id, i.provider_id, i.label, i.enabled, i.created_at, i.last_sync_at,
               p.name as provider_name, p.description as provider_desc
        FROM integrations i
        JOIN integration_providers p ON p.id = i.provider_id
        ORDER BY i.created_at DESC
      `;
      return {
        ok: true,
        data: {
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
        },
      };
    } catch (err: any) {
      if (err?.message?.includes("DATABASE_URL is not set")) {
        return {
          ok: true,
          data: { integrations: [] },
          dbStatus: "disconnected",
        };
      }
      return { ok: false, error: "Internal server error" };
    }
  },
);

/** Check if the database is connected */
export const checkDbStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<boolean> => {
    try {
      const db = (await import("~/db")).sql();
      await db`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  },
);

/** Delete an integration */
export const deleteIntegration = createServerFn({ method: "POST" }).handler(
  async (payload: { id: string }): Promise<ApiResult<null>> => {
    try {
      const db = (await import("~/db")).sql();
      await db`DELETE FROM integrations WHERE id = ${payload.id}`;
      return { ok: true };
    } catch (err: any) {
      if (err?.message?.includes("DATABASE_URL is not set")) {
        return { ok: true, dbStatus: "disconnected" };
      }
      return { ok: false, error: "Internal server error" };
    }
  },
);