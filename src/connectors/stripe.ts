/**
 * Stripe Connector
 *
 * Integrates with Stripe for payment processing and invoicing.
 */
import type { Connector } from "./types";

export const stripeConnector: Connector = {
  id: "stripe",
  name: "Stripe",
  description: "Payment processing, invoicing, and subscription management",
  icon: "💳",
  authType: "api_key",
  configFields: [
    {
      key: "api_key",
      label: "Secret API Key",
      type: "password",
      required: true,
      placeholder: "sk_live_...",
    },
    {
      key: "webhook_secret",
      label: "Webhook Signing Secret",
      type: "password",
      required: false,
      placeholder: "whsec_...",
    },
  ],

  validate: async (config) => {
    // In production: make a test call to Stripe API
    // For now: check that the key looks like a Stripe key
    const key = config.api_key || "";
    return key.startsWith("sk_live_") || key.startsWith("sk_test_");
  },

  operations: [
    {
      id: "list_new_payments",
      name: "List new payments",
      description: "Retrieve recently created payments/intents",
      paramsSchema: {
        type: "object",
        properties: {
          since: {
            type: "string",
            description: "ISO timestamp to fetch payments since",
          },
          limit: {
            type: "number",
            description: "Maximum number of payments to return",
            default: 10,
          },
        },
      },
      execute: async (config, params) => {
        // Placeholder — would call Stripe API
        return {
          status: "simulated",
          payments: [],
          message: `Would fetch payments since ${params.since || "last check"} (limited to ${params.limit || 10})`,
        };
      },
    },
    {
      id: "create_invoice",
      name: "Create invoice",
      description: "Create a new invoice for a customer",
      paramsSchema: {
        type: "object",
        properties: {
          customer_email: { type: "string", description: "Customer email" },
          amount: { type: "number", description: "Amount in cents" },
          description: { type: "string", description: "Invoice description" },
        },
        required: ["customer_email", "amount"],
      },
      execute: async (config, params) => {
        return {
          status: "simulated",
          invoice_id: `in_sim_${crypto.randomUUID().slice(0, 8)}`,
          message: `Would create invoice for ${params.customer_email} for $${((params.amount as number) / 100).toFixed(2)}`,
        };
      },
    },
    {
      id: "reconcile_transactions",
      name: "Reconcile transactions",
      description: "Match payments against invoices and flag discrepancies",
      paramsSchema: {
        type: "object",
        properties: {
          date_range: {
            type: "string",
            description: "Date range to reconcile (e.g. 'last_7_days')",
          },
        },
      },
      execute: async (config, params) => {
        return {
          status: "simulated",
          matched: 0,
          discrepancies: 0,
          message: `Would reconcile transactions for ${params.date_range || "today"}`,
        };
      },
    },
  ],
};