/**
 * Slack Connector
 *
 * Integrates with Slack for team messaging and notifications.
 */
import type { Connector } from "./types";

export const slackConnector: Connector = {
  id: "slack",
  name: "Slack",
  description: "Team messaging, channel notifications, and file sharing",
  icon: "💬",
  authType: "oauth2",
  configFields: [
    {
      key: "bot_token",
      label: "Bot User OAuth Token",
      type: "password",
      required: true,
      placeholder: "xoxb-...",
    },
    {
      key: "signing_secret",
      label: "Signing Secret",
      type: "password",
      required: false,
    },
  ],

  validate: async (config) => {
    const token = config.bot_token || "";
    return token.startsWith("xoxb-");
  },

  operations: [
    {
      id: "send_message",
      name: "Post message",
      description: "Post a message to a Slack channel",
      paramsSchema: {
        type: "object",
        properties: {
          channel: {
            type: "string",
            description: "Channel ID or name (e.g. #general or C12345)",
          },
          text: { type: "string", description: "Message text" },
        },
        required: ["channel", "text"],
      },
      execute: async (config, params) => {
        return {
          status: "simulated",
          channel: params.channel,
          ts: `${Date.now()}.000001`,
          message: `Would post message to ${params.channel}`,
        };
      },
    },
    {
      id: "list_channels",
      name: "List channels",
      description: "List public channels the bot has access to",
      paramsSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Max channels to return", default: 20 },
        },
      },
      execute: async (config, params) => {
        return {
          status: "simulated",
          channels: [],
          total: 0,
          message: `Would list up to ${params.limit || 20} channels`,
        };
      },
    },
    {
      id: "add_reaction",
      name: "Add reaction",
      description: "Add an emoji reaction to a message",
      paramsSchema: {
        type: "object",
        properties: {
          channel: { type: "string", description: "Channel containing the message" },
          timestamp: { type: "string", description: "Message timestamp (ts)" },
          reaction: { type: "string", description: "Emoji name (e.g. thumbsup)" },
        },
        required: ["channel", "timestamp", "reaction"],
      },
      execute: async (config, params) => {
        return {
          status: "simulated",
          reaction: params.reaction,
          message: `Would add :${params.reaction}: reaction in ${params.channel}`,
        };
      },
    },
  ],
};