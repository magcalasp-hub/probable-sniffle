-- Nexus Platform: Initial Schema
-- Run against Neon Postgres via DATABASE_URL
-- Usage: cat db/migrations/001_initial.sql | psql $DATABASE_URL

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  plan          TEXT NOT NULL DEFAULT 'starter',
  -- plan: 'starter', 'pro', 'enterprise'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- Sessions
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ============================================
-- Integration Providers (seed data reference table)
-- ============================================
CREATE TABLE IF NOT EXISTS integration_providers (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  icon_url      TEXT,
  auth_type     TEXT NOT NULL DEFAULT 'oauth2',
  -- auth_type: 'oauth2', 'api_key', 'webhook'
  config_schema JSONB DEFAULT '{}'
);

-- Seed some providers
INSERT INTO integration_providers (id, name, description, auth_type) VALUES
  ('stripe', 'Stripe', 'Payment processing and invoicing', 'oauth2'),
  ('gmail', 'Gmail', 'Email composition and inbox management', 'oauth2'),
  ('calendly', 'Calendly', 'Appointment scheduling', 'oauth2'),
  ('slack', 'Slack', 'Team messaging and notifications', 'oauth2'),
  ('shopify', 'Shopify', 'E-commerce platform', 'oauth2'),
  ('hubspot', 'HubSpot', 'CRM and marketing automation', 'oauth2'),
  ('notion', 'Notion', 'Docs and knowledge base', 'oauth2')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Connected Integrations (per user)
-- ============================================
CREATE TABLE IF NOT EXISTS integrations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id       TEXT NOT NULL REFERENCES integration_providers(id),
  label             TEXT,
  config            JSONB NOT NULL DEFAULT '{}',
  -- config: encrypted credentials + user settings
  enabled           BOOLEAN NOT NULL DEFAULT true,
  last_sync_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_integrations_user ON integrations(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_integrations_user_provider
  ON integrations(user_id, provider_id);

-- ============================================
-- Workflows
-- ============================================
CREATE TABLE IF NOT EXISTS workflows (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  trigger_type    TEXT NOT NULL,
  -- trigger_type: 'webhook', 'schedule', 'manual'
  trigger_config  JSONB NOT NULL DEFAULT '{}',
  -- trigger_config: { "cron": "0 */6 * * *" } or { "webhook_path": "..." }
  actions         JSONB NOT NULL DEFAULT '[]',
  -- actions: [ { "integration_id": "...", "operation": "...", "params": {...} }, ... ]
  enabled         BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflows_user ON workflows(user_id);

-- ============================================
-- Workflow Runs (execution history)
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id     UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending',
  -- status: 'pending', 'running', 'success', 'failed'
  trigger         TEXT NOT NULL,
  -- trigger: 'webhook', 'schedule', 'manual', 'test'
  input           JSONB,
  output          JSONB,
  error_log       TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow ON workflow_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_user ON workflow_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_created ON workflow_runs(created_at DESC);