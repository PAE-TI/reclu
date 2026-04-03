import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function normalizeDatabaseUrl(rawUrl: string, isPooled: boolean): string {
  const url = new URL(rawUrl)

  // Force connection_limit=1 for serverless
  url.searchParams.set('connection_limit', process.env.DATABASE_CONNECTION_LIMIT || '1')
  url.searchParams.set('pool_timeout', process.env.DATABASE_POOL_TIMEOUT || '20')

  // pgbouncer mode required when using a connection pooler
  if (isPooled && !url.searchParams.has('pgbouncer')) {
    url.searchParams.set('pgbouncer', 'true')
  }

  return url.toString()
}

function derivePoolUrl(directUrl: string): string {
  // DigitalOcean: direct=25060, PgBouncer=25061
  return directUrl.replace(':25060/', ':25061/')
}

function resolveDatabaseUrl(): string | undefined {
  const poolUrl = process.env.DATABASE_POOL_URL
  const directUrl = process.env.DATABASE_URL

  if (poolUrl) {
    return normalizeDatabaseUrl(poolUrl, true)
  }

  if (directUrl) {
    // Auto-derive PgBouncer URL for DigitalOcean managed databases
    const derived = derivePoolUrl(directUrl)
    // Only use derived pool URL if port actually changed (i.e. it was a DO direct URL)
    if (derived !== directUrl) {
      console.log('Using auto-derived PgBouncer URL (port 25061)')
      return normalizeDatabaseUrl(derived, true)
    }
    return normalizeDatabaseUrl(directUrl, false)
  }

  return undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolveDatabaseUrl(),
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

