/**
 * Connector Registry
 *
 * Plugin registry for integration connectors. Connectors register themselves
 * here and are discoverable by id, name, or list.
 */
import type { Connector } from "./types";

const registry = new Map<string, Connector>();

/** Register a connector plugin */
export function register(connector: Connector): void {
  if (registry.has(connector.id)) {
    console.warn(`Connector "${connector.id}" is already registered — overwriting`);
  }
  registry.set(connector.id, connector);
}

/** Get a connector by its provider id */
export function get(id: string): Connector | undefined {
  return registry.get(id);
}

/** List all registered connectors */
export function list(): Connector[] {
  return Array.from(registry.values());
}

/** Get connectors by auth type */
export function listByAuthType(authType: string): Connector[] {
  return list().filter((c) => c.authType === authType);
}