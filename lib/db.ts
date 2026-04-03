import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function buildDatabaseUrl(): string | undefined {
  const poolUrl = process.env.DATABASE_POOL_URL
  const directUrl = process.env.DATABASE_URL

  const raw = poolUrl || directUrl
  if (!raw) return undefined

  const url = new URL(raw)
  const isPooled = Boolean(poolUrl)

  // Enforce low connection limit for serverless
  url.searchParams.set('connection_limit', process.env.DATABASE_CONNECTION_LIMIT || '1')
  url.searchParams.set('pool_timeout', process.env.DATABASE_POOL_TIMEOUT || '10')

  // Required for PgBouncer compatibility (disables prepared statements)
  if (isPooled) {
    url.searchParams.set('pgbouncer', 'true')
    url.searchParams.set('statement_cache_size', '0')
  }

  return url.toString()
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: buildDatabaseUrl() } },
  })

// Cache singleton across ALL invocations (warm + cold) to reuse connections
globalForPrisma.prisma = prisma


