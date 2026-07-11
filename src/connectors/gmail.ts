/**
 * Gmail Connector
 *
 * Integrates with Gmail for email composition and inbox management.
 */
import type { Connector } from "./types";

export const gmailConnector: Connector = {
  id: "gmail",
  name: "Gmail",
  description: "Email composition, inbox search, and message management",
  icon: "📧",
  authType: "oauth2",
  configFields: [
    {
      key: "client_id",
      label: "OAuth Client ID",
      type: "text",
      required: true,
    },
    {
      key: "client_secret",
      label: "OAuth Client Secret",
      type: "password",
      required: true,
    },
    {
      key: "redirect_uri",
      label: "Redirect URI",
      type: "url",
      required: true,
      placeholder: "https://your-app.com/api/webhooks/gmail/callback",
    },
    {
      key: "refresh_token",
      label: "Refresh Token",
      type: "password",
      required: false,
    },
  ],

  validate: async (config) => {
    // Would validate by making a test API call
    return !!config.refresh_token;
  },

  getOAuthUrl: (state) => {
    const params = new URLSearchParams({
      client_id: "__CLIENT_ID__",
      redirect_uri: "__REDIRECT_URI__",
      response_type: "code",
      scope: "https://www.googleapis.com/auth/gmail.modify",
      state,
      access_type: "offline",
      prompt: "consent",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },

  exchangeOAuthCode: async (code, config) => {
    // Placeholder — would exchange code for tokens via Google API
    return {
      refresh_token: `rt_sim_${crypto.randomUUID().slice(0, 12)}`,
      access_token: `at_sim_${crypto.randomUUID().slice(0, 12)}`,
      expires_in: "3600",
    };
  },

  operations: [
    {
      id: "send_email",
      name: "Send email",
      description: "Send an email to one or more recipients",
      paramsSchema: {
        type: "object",
        properties: {
          to: { type: "string", description: "Recipient email address(es)" },
          subject: { type: "string", description: "Email subject" },
          body: { type: "string", description: "Email body text" },
          cc: { type: "string", description: "CC recipients" },
        },
        required: ["to", "subject", "body"],
      },
      execute: async (config, params) => {
        return {
          status: "simulated",
          message_id: `<sim_${Date.now()}@nexus.app>`,
          message: `Would send email to ${params.to} with subject "${params.subject}"`,
        };
      },
    },
    {
      id: "search_inbox",
      name: "Search inbox",
      description: "Search messages in the inbox matching a query",
      paramsSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Gmail search query",
            example: "from:stripe subject:receipt",
          },
          max_results: { type: "number", description: "Max messages to return", default: 10 },
        },
        required: ["query"],
      },
      execute: async (config, params) => {
        return {
          status: "simulated",
          messages: [],
          total: 0,
          query: params.query,
          message: `Would search inbox for "${params.query}"`,
        };
      },
    },
    {
      id: "archive_thread",
      name: "Archive thread",
      description: "Remove a thread from the inbox",
      paramsSchema: {
        type: "object",
        properties: {
          thread_id: { type: "string", description: "Gmail thread ID to archive" },
        },
        required: ["thread_id"],
      },
      execute: async (config, params) => {
        return {
          status: "simulated",
          thread_id: params.thread_id,
          message: `Would archive thread ${params.thread_id}`,
        };
      },
    },
  ],
};