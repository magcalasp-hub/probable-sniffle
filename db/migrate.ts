#!/usr/bin/env bun
/**
 * Run database migrations against Neon Postgres.
 * Usage: bun run db:migrate
 *
 * Requires DATABASE_URL to be set.
 */
import { sql } from "../src/db";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  console.log("Running database migrations...");

  const migrationPath = resolve(__dirname, "migrations/001_initial.sql");
  const migration = readFileSync(migrationPath, "utf8");

  // Strip SQL comment lines (-- ...) so they don't interfere with statement splitting
  const cleaned = migration
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  // Split by semicolons to get individual statements
  const statements = cleaned
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (statements.length === 0) {
    console.log("No migration statements found.");
    return;
  }

  const db = sql();
  let successCount = 0;
  let skipCount = 0;

  for (const statement of statements) {
    try {
      await db.raw(statement);
      console.log(`  ✓ ${statement.slice(0, 70)}...`);
      successCount++;
    } catch (err: any) {
      // Ignore "already exists" errors for idempotency
      if (
        err?.message?.includes("already exists") ||
        err?.message?.includes("duplicate key") ||
        err?.message?.includes("already exists, skipping")
      ) {
        console.log(`  - Skipped (exists): ${statement.slice(0, 60)}...`);
        skipCount++;
      } else {
        console.error(`  ✗ Failed: ${statement.slice(0, 60)}...`);
        throw err;
      }
    }
  }

  console.log(
    `\nMigration complete! ${String(successCount)} executed, ${String(skipCount)} skipped.`,
  );
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});