import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. The application cannot start without a database connection.",
  );
}

/**
 * postgres.js connection options tuned for a serverless deployment (Vercel) in
 * front of a connection-limited managed Postgres (Aiven).
 *
 * Without these, postgres.js defaults to a pool of 10 with no idle timeout, so
 * every serverless instance holds open connections indefinitely. Under any real
 * traffic that exhausts Aiven's connection cap and queries start failing
 * intermittently — surfacing as the dashboard "Something went wrong" page,
 * worst on the heaviest DB paths like /brand.
 *
 *   max            one connection per serverless instance — combined with many
 *                  short-lived instances this stays well under the DB cap.
 *   idle_timeout   release the connection shortly after a request finishes so a
 *                  cold/idle instance doesn't keep a slot reserved.
 *   connect_timeout fail fast instead of hanging when the DB is unreachable.
 *   prepare:false  required when routed through a transaction pooler (PgBouncer)
 *                  and harmless on a direct connection.
 *
 * SSL is driven by the `sslmode` query param on DATABASE_URL (Aiven requires
 * `?sslmode=require`; the local dev URL omits it), so it needs no flag here.
 */
const connectionOptions = {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
} as const;

// Reuse a single client across Next.js dev hot-reloads to avoid leaking a new
// connection pool on every module reload.
const globalForDb = globalThis as unknown as {
  __postgresClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__postgresClient ?? postgres(databaseUrl, connectionOptions);

if (process.env.NODE_ENV !== "production") {
  globalForDb.__postgresClient = client;
}

export const db = drizzle(client, { schema });
