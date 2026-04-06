import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export type AdminAuditAction =
  | 'SETTING_UPDATE'
  | 'USER_STATUS_UPDATE'
  | 'USER_ROLE_UPDATE'
  | 'USER_DELETE'
  | 'CREDIT_RECHARGE'
  | 'USER_LOCKED'
  | 'USER_UNLOCKED';

export async function createAdminAuditLog(params: {
  actorUserId: string;
  action: AdminAuditAction | string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown> | null;
  request?: NextRequest | Request;
}) {
  try {
    const ipAddress =
      params.request?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      params.request?.headers.get('x-real-ip') ||
      null;
    const userAgent = params.request?.headers.get('user-agent') || null;

    await prisma.adminAuditLog.create({
      data: {
        actorUserId: params.actorUserId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId || null,
        summary: params.summary,
        metadata: params.metadata ? (params.metadata as Prisma.InputJsonValue) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Error creating admin audit log:', error);
  }
}

export async function listRecentAdminAuditLogs(limit = 20) {
  return prisma.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 100),
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
