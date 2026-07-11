/**
 * Connectors index — registers all connector plugins on import.
 * Import this module to populate the connector registry.
 */
import { register } from "./registry";
import { stripeConnector } from "./stripe";
import { gmailConnector } from "./gmail";
import { slackConnector } from "./slack";

// Register all connectors
register(stripeConnector);
register(gmailConnector);
register(slackConnector);

export { get, list, listByAuthType } from "./registry";
export type { Connector, ConnectorOperation, AuthType, ConfigField } from "./types";
export { stripeConnector } from "./stripe";
export { gmailConnector } from "./gmail";
export { slackConnector } from "./slack";