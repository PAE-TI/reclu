import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var __recluPool: Pool | undefined;
}

function createPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const shouldUseSsl =
    databaseUrl.includes("sslmode=require") ||
    process.env.PGSSLMODE === "require" ||
    (process.env.NODE_ENV === "production" && databaseUrl.includes("ondigitalocean.com"));

  return new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30_000,
    ssl: shouldUseSsl
      ? {
          rejectUnauthorized: false,
          checkServerIdentity: () => undefined,
        }
      : undefined,
  });
}

function getPool() {
  if (!globalThis.__recluPool) {
    globalThis.__recluPool = createPool();
  }
  return globalThis.__recluPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, params);
}
