/**
 * Integration Connector Types
 *
 * Defines the plugin interface that every connector must implement.
 * Connectors are self-contained modules that handle auth and operations
 * for a specific third-party service.
 */

/** The type of authentication the connector uses */
export type AuthType = "oauth2" | "api_key" | "webhook";

/** Configuration schema field definition */
export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "password" | "select" | "url";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

/** A single operation that a connector can perform (e.g. "send_email") */
export interface ConnectorOperation {
  /** Unique operation id within this connector (e.g. "send_email") */
  id: string;
  /** Human-readable name */
  name: string;
  /** Short description of what this operation does */
  description: string;
  /** JSON Schema for the parameters this operation accepts */
  paramsSchema: Record<string, unknown>;
  /**
   * Execute the operation.
   * @param config - The stored integration config (credentials + settings)
   * @param params - Operation-specific parameters from the workflow action
   * @returns The result data
   */
  execute: (
    config: Record<string, string>,
    params: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;
}

/** A connector plugin that integrates with a third-party service */
export interface Connector {
  /** Unique provider id (e.g. "stripe", "gmail") */
  id: string;
  /** Human-readable name (e.g. "Stripe") */
  name: string;
  /** Short description */
  description: string;
  /** Icon URL (emoji or SVG data URI) */
  icon: string;
  /** The type of auth this provider uses */
  authType: AuthType;
  /** Fields for the auth/connection configuration form */
  configFields: ConfigField[];
  /**
   * Test the connection / validate credentials.
   * Returns true if credentials are valid.
   */
  validate: (config: Record<string, string>) => Promise<boolean>;
  /** The operations this connector supports */
  operations: ConnectorOperation[];
  /**
   * Get OAuth URL (only for oauth2 connectors).
   * Returns the URL to redirect the user to for authorization.
   */
  getOAuthUrl?: (state: string) => string;
  /**
   * Exchange OAuth code for tokens (only for oauth2 connectors).
   */
  exchangeOAuthCode?: (
    code: string,
    config?: Record<string, string>,
  ) => Promise<Record<string, string>>;
}