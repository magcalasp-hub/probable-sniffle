#!/usr/bin/env bun
/**
 * Run database migrations against Neon Postgres.
 * Usage: bun run db:migrate
 *
 * Requires DATABASE_URL to be set.
 */
import { sql } from "~/db";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  console.log("Running database migrations...");

  const migrationPath = resolve(__dirname, "migrations/001_initial.sql");
  const migration = readFileSync(migrationPath, "utf8");

  // Split by semicolons (naive but works for our migration)
  const statements = migration
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  const db = sql();

  for (const statement of statements) {
    try {
      await db.raw(statement);
      console.log(`  ✓ Executed: ${statement.slice(0, 60)}...`);
    } catch (err: any) {
      // Ignore "already exists" errors for idempotency
      if (
        err?.message?.includes("already exists") ||
        err?.message?.includes("duplicate key")
      ) {
        console.log(`  - Skipped (exists): ${statement.slice(0, 60)}...`);
      } else {
        throw err;
      }
    }
  }

  console.log("Migration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});