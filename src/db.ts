import { neon } from "@neondatabase/serverless";

/**
 * Server-only handle to the team's database (Neon serverless Postgres over HTTP).
 * The connection string comes from `DATABASE_URL`.
 *
 * Resolved lazily (per call, not at module load) so the site still builds
 * and serves before a database is connected.
 *
 * Usage (inside createServerFn or API routes only):
 *   const db = sql();
 *   const rows = await db`select * from users`;
 *
 * For raw SQL statements (migrations):
 *   const db = sql();
 *   await db.raw("CREATE TABLE ...");
 */
export const sql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — connect a database (via the database card) before running queries.",
    );
  }
  const client = neon(url);

  // Add a `raw` method for migration statements
  return Object.assign(client, {
    raw: async (statement: string) => {
      // Neon's HTTP driver handles raw SQL via the tagged template
      return await client(statement as any);
    },
  });
};