import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function normalizeDatabaseUrl(rawUrl: string | undefined | null): string | undefined {
  if (!rawUrl) return undefined

  const url = new URL(rawUrl)
  const connectionLimit = process.env.DATABASE_CONNECTION_LIMIT || '1'
  const poolTimeout = process.env.DATABASE_POOL_TIMEOUT || '20'

  if (!url.searchParams.has('connection_limit')) {
    url.searchParams.set('connection_limit', connectionLimit)
  }

  if (!url.searchParams.has('pool_timeout')) {
    url.searchParams.set('pool_timeout', poolTimeout)
  }

  return url.toString()
}

function resolveDatabaseUrl() {
  return normalizeDatabaseUrl(process.env.DATABASE_POOL_URL || process.env.DATABASE_URL)
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
