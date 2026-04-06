import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { buildAppUrl } from '@/lib/site-url';

const isProduction = process.env.NODE_ENV === 'production';
const RESULTS_PORTAL_COOKIE = isProduction
  ? '__Secure-results-portal-session'
  : 'results-portal-session';
const RESULTS_PORTAL_SECRET =
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || process.env.JWT_SECRET || '';
const RESULTS_PORTAL_EXPIRY_SECONDS = 7 * 24 * 60 * 60;
const RESULTS_PORTAL_CODE_EXPIRY_MINUTES = 15;
const PORTAL_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export type PortalEvaluationType =
  | 'disc'
  | 'driving-forces'
  | 'eq'
  | 'dna'
  | 'acumen'
  | 'values'
  | 'stress'
  | 'technical';

export interface PortalEvaluationMetric {
  label: string;
  value: string;
}

export interface PortalEvaluationSummary {
  accent: 'indigo' | 'emerald' | 'rose' | 'teal' | 'amber' | 'violet' | 'orange' | 'sky';
  title: string;
  description: string;
  metrics: PortalEvaluationMetric[];
}

export interface PortalEvaluationRecord {
  id: string;
  token: string;
  type: PortalEvaluationType;
  typeLabel: string;
  title: string;
  contextLabel: string | null;
  description: string | null;
  recipientName: string;
  recipientEmail: string;
  senderName: string | null;
  senderCompany: string | null;
  status: string;
  tokenExpiry: string;
  completedAt: string | null;
  createdAt: string;
  result: unknown | null;
  summary: PortalEvaluationSummary;
}

interface PortalTokenPayload {
  email: string;
  purpose: 'results-portal';
}

export function normalizePortalEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePortalCode(code: string) {
  return code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

export function formatPortalCode(code: string) {
  const normalized = normalizePortalCode(code);
  if (normalized.length <= 4) {
    return normalized;
  }
  return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}`;
}

export function generatePortalAccessCode(length = 8) {
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += PORTAL_CODE_ALPHABET[bytes[i] % PORTAL_CODE_ALPHABET.length];
  }
  return code;
}

export function buildResultsPortalLink(email: string, code: string) {
  const normalizedEmail = normalizePortalEmail(email);
  return buildAppUrl(`/mis-resultados?email=${encodeURIComponent(normalizedEmail)}`);
}

export function createPortalSessionToken(email: string) {
  if (!RESULTS_PORTAL_SECRET) {
    throw new Error('NEXTAUTH_SECRET no configurado');
  }

  return jwt.sign(
    {
      email: normalizePortalEmail(email),
      purpose: 'results-portal',
    } satisfies PortalTokenPayload,
    RESULTS_PORTAL_SECRET,
    { expiresIn: RESULTS_PORTAL_EXPIRY_SECONDS }
  );
}

export function verifyPortalSessionToken(token: string): string | null {
  if (!RESULTS_PORTAL_SECRET) {
    return null;
  }

  try {
    const payload = jwt.verify(token, RESULTS_PORTAL_SECRET) as jwt.JwtPayload & PortalTokenPayload;
    if (payload?.purpose !== 'results-portal' || !payload.email) {
      return null;
    }
    return normalizePortalEmail(payload.email);
  } catch {
    return null;
  }
}

export function getPortalEmailFromRequest(request: NextRequest) {
  const rawToken = request.cookies.get(RESULTS_PORTAL_COOKIE)?.value;
  if (!rawToken) {
    return null;
  }
  return verifyPortalSessionToken(rawToken);
}

export function setPortalSessionCookie(response: NextResponse, email: string) {
  const token = createPortalSessionToken(email);
  response.cookies.set({
    name: RESULTS_PORTAL_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: RESULTS_PORTAL_EXPIRY_SECONDS,
  });
}

export function clearPortalSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: RESULTS_PORTAL_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    expires: new Date(0),
  });
}

function formatSenderName(senderUser: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
} | null) {
  if (!senderUser) return null;
  const firstName = senderUser.firstName?.trim();
  const lastName = senderUser.lastName?.trim();
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ').trim();
  }
  return senderUser.name?.trim() || null;
}

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/D';
  }
  return `${Math.round(value)}%`;
}

function formatSeconds(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/D';
  }
  if (value < 60) {
    return `${Math.round(value)}s`;
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.round(value % 60);
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

function performanceLabel(level: string | null | undefined) {
  const normalized = String(level || '').toUpperCase();
  const labels: Record<string, string> = {
    EXCELLENT: 'Excelente',
    GOOD: 'Sólido',
    AVERAGE: 'Promedio',
    BELOW_AVERAGE: 'Por debajo del promedio',
    POOR: 'Bajo',
  };
  return labels[normalized] || 'Pendiente';
}

function buildEmptySummary(accent: PortalEvaluationSummary['accent'], title: string, description: string): PortalEvaluationSummary {
  return {
    accent,
    title,
    description,
    metrics: [],
  };
}

function buildDiscSummary(result: any): PortalEvaluationSummary {
  if (!result) return buildEmptySummary('indigo', 'Pendiente', 'Aún no hay resultados disponibles.');
  return {
    accent: 'indigo',
    title: result.personalityType || result.primaryStyle || 'Perfil DISC',
    description: `Estilo principal ${result.primaryStyle || 'N/D'}${result.secondaryStyle ? ` · Secundario ${result.secondaryStyle}` : ''}`,
    metrics: [
      { label: 'Intensidad', value: formatScore(result.styleIntensity) },
      { label: 'D', value: formatScore(result.percentileD) },
      { label: 'I', value: formatScore(result.percentileI) },
      { label: 'S', value: formatScore(result.percentileS) },
      { label: 'C', value: formatScore(result.percentileC) },
    ],
  };
}

function buildDrivingForcesSummary(result: any): PortalEvaluationSummary {
  if (!result) return buildEmptySummary('emerald', 'Pendiente', 'Aún no hay resultados disponibles.');
  return {
    accent: 'emerald',
    title: result.motivationalProfile || 'Driving Forces',
    description: `Motivador principal: ${result.topMotivator || 'N/D'}`,
    metrics: [
      { label: '1', value: result.topMotivator || 'N/D' },
      { label: '2', value: result.secondMotivator || 'N/D' },
      { label: '3', value: result.thirdMotivator || 'N/D' },
      { label: '4', value: result.fourthMotivator || 'N/D' },
    ],
  };
}

function buildEQSummary(result: any): PortalEvaluationSummary {
  if (!result) return buildEmptySummary('rose', 'Pendiente', 'Aún no hay resultados disponibles.');
  return {
    accent: 'rose',
    title: result.eqLevel || 'EQ',
    description: result.eqProfile ? `Perfil ${result.eqProfile}` : 'Inteligencia emocional evaluada',
    metrics: [
      { label: 'Total', value: formatScore(result.totalEQPercentile) },
      { label: 'Autoconciencia', value: formatScore(result.selfAwarenessPercentile) },
      { label: 'Autorregulación', value: formatScore(result.selfRegulationPercentile) },
      { label: 'Empatía', value: formatScore(result.empathyPercentile) },
    ],
  };
}

function buildDNASummary(result: any): PortalEvaluationSummary {
  if (!result) return buildEmptySummary('teal', 'Pendiente', 'Aún no hay resultados disponibles.');
  return {
    accent: 'teal',
    title: result.dnaLevel || 'DNA-25',
    description: result.dnaProfile ? `Perfil ${result.dnaProfile}` : 'Competencias evaluadas',
    metrics: [
      { label: 'Total', value: formatScore(result.totalDNAPercentile) },
      { label: 'Pensamiento', value: formatScore(result.thinkingCategoryScore) },
      { label: 'Comunicación', value: formatScore(result.communicationCategoryScore) },
      { label: 'Liderazgo', value: formatScore(result.leadershipCategoryScore) },
    ],
  };
}

function buildAcumenSummary(result: any): PortalEvaluationSummary {
  if (!result) return buildEmptySummary('amber', 'Pendiente', 'Aún no hay resultados disponibles.');
  return {
    accent: 'amber',
    title: result.acumenLevel || 'Acumen',
    description: result.acumenProfile ? `Perfil ${result.acumenProfile}` : 'Clarity assessment',
    metrics: [
      { label: 'Total', value: formatScore(result.totalAcumenScore) },
      { label: 'Externa', value: formatScore(result.externalClarityScore) },
      { label: 'Interna', value: formatScore(result.internalClarityScore) },
    ],
  };
}

function buildValuesSummary(result: any): PortalEvaluationSummary {
  if (!result) return buildEmptySummary('violet', 'Pendiente', 'Aún no hay resultados disponibles.');
  return {
    accent: 'violet',
    title: result.valuesLevel || 'Valores',
    description: result.valuesProfile ? `Perfil ${result.valuesProfile}` : 'Sistema de valores evaluado',
    metrics: [
      { label: 'Total', value: formatScore(result.totalValuesScore) },
      { label: 'Integridad', value: formatScore(result.integrityScore) },
      { label: 'Autenticidad', value: formatScore(result.authenticityScore) },
      { label: 'Consistencia', value: formatScore(result.consistencyScore) },
    ],
  };
}

function buildStressSummary(result: any): PortalEvaluationSummary {
  if (!result) return buildEmptySummary('orange', 'Pendiente', 'Aún no hay resultados disponibles.');
  return {
    accent: 'orange',
    title: result.stressLevel || 'Estrés y Resiliencia',
    description: result.stressProfile ? `Perfil ${result.stressProfile}` : `Resiliencia ${result.resilienceLevel || 'N/D'}`,
    metrics: [
      { label: 'Estrés', value: formatScore(result.nivelEstresGeneral) },
      { label: 'Resiliencia', value: formatScore(result.indiceResiliencia) },
      { label: 'Adaptación', value: formatScore(result.capacidadAdaptacion) },
    ],
  };
}

function buildTechnicalSummary(result: any): PortalEvaluationSummary {
  if (!result) return buildEmptySummary('sky', 'Pendiente', 'Aún no hay resultados disponibles.');
  return {
    accent: 'sky',
    title: performanceLabel(result.performanceLevel),
    description: `${formatScore(result.totalScore)} de acierto en ${result.totalQuestions || 0} preguntas`,
    metrics: [
      { label: 'Aciertos', value: `${result.correctAnswers || 0}/${result.totalQuestions || 0}` },
      { label: 'Tiempo prom.', value: formatSeconds(result.averageTimePerQuestion) },
      { label: 'Categorías', value: result.categoryScores ? Object.keys(result.categoryScores).length.toString() : '0' },
    ],
  };
}

function buildSummary(type: PortalEvaluationType, result: any): PortalEvaluationSummary {
  switch (type) {
    case 'disc':
      return buildDiscSummary(result);
    case 'driving-forces':
      return buildDrivingForcesSummary(result);
    case 'eq':
      return buildEQSummary(result);
    case 'dna':
      return buildDNASummary(result);
    case 'acumen':
      return buildAcumenSummary(result);
    case 'values':
      return buildValuesSummary(result);
    case 'stress':
      return buildStressSummary(result);
    case 'technical':
      return buildTechnicalSummary(result);
    default:
      return buildEmptySummary('indigo', 'Pendiente', 'Aún no hay resultados disponibles.');
  }
}

function createPortalRecordBase<T extends { id: string; token: string; title: string; description: string | null; recipientName: string; recipientEmail: string; senderUserId: string; tokenExpiry: Date; status: string; createdAt: Date; completedAt: Date | null; senderUser?: { firstName?: string | null; lastName?: string | null; name?: string | null; company?: string | null } | null; result?: unknown | null; }>(
  type: PortalEvaluationType,
  typeLabel: string,
  evaluation: T,
  contextLabel: string | null = null
): PortalEvaluationRecord {
  return {
    id: evaluation.id,
    token: evaluation.token,
    type,
    typeLabel,
    title: evaluation.title,
    contextLabel,
    description: evaluation.description,
    recipientName: evaluation.recipientName,
    recipientEmail: evaluation.recipientEmail,
    senderName: formatSenderName(evaluation.senderUser || null),
    senderCompany: evaluation.senderUser?.company || null,
    status: evaluation.status,
    tokenExpiry: evaluation.tokenExpiry.toISOString(),
    completedAt: evaluation.completedAt ? evaluation.completedAt.toISOString() : null,
    createdAt: evaluation.createdAt.toISOString(),
    result: evaluation.result ?? null,
    summary: buildSummary(type, evaluation.result ?? null),
  };
}

export async function getPortalEvaluationsByEmail(email: string): Promise<PortalEvaluationRecord[]> {
  const normalizedEmail = normalizePortalEmail(email);
  const emailFilter = { equals: normalizedEmail, mode: 'insensitive' as const };

  const [
    discEvaluations,
    drivingForcesEvaluations,
    eqEvaluations,
    dnaEvaluations,
    acumenEvaluations,
    valuesEvaluations,
    stressEvaluations,
    technicalEvaluations,
  ] = await Promise.all([
    prisma.externalEvaluation.findMany({
      where: { recipientEmail: emailFilter },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, name: true, company: true },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalDrivingForcesEvaluation.findMany({
      where: { recipientEmail: emailFilter },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, name: true, company: true },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalEQEvaluation.findMany({
      where: { recipientEmail: emailFilter },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, name: true, company: true },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalDNAEvaluation.findMany({
      where: { recipientEmail: emailFilter },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, name: true, company: true },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalAcumenEvaluation.findMany({
      where: { recipientEmail: emailFilter },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, name: true, company: true },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalValuesEvaluation.findMany({
      where: { recipientEmail: emailFilter },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, name: true, company: true },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalStressEvaluation.findMany({
      where: { recipientEmail: emailFilter },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, name: true, company: true },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.externalTechnicalEvaluation.findMany({
      where: { recipientEmail: emailFilter },
      include: {
        senderUser: {
          select: { firstName: true, lastName: true, name: true, company: true },
        },
        result: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const records = [
    ...discEvaluations.map((evaluation) => createPortalRecordBase('disc', 'DISC', evaluation)),
    ...drivingForcesEvaluations.map((evaluation) => createPortalRecordBase('driving-forces', 'Driving Forces', evaluation)),
    ...eqEvaluations.map((evaluation) => createPortalRecordBase('eq', 'Inteligencia Emocional', evaluation)),
    ...dnaEvaluations.map((evaluation) => createPortalRecordBase('dna', 'Competencias DNA-25', evaluation)),
    ...acumenEvaluations.map((evaluation) => createPortalRecordBase('acumen', 'Acumen (ACI)', evaluation)),
    ...valuesEvaluations.map((evaluation) => createPortalRecordBase('values', 'Valores e Integridad', evaluation)),
    ...stressEvaluations.map((evaluation) => createPortalRecordBase('stress', 'Estrés y Resiliencia', evaluation)),
    ...technicalEvaluations.map((evaluation) => createPortalRecordBase('technical', 'Prueba Técnica', evaluation, evaluation.jobPositionTitle)),
  ];

  return records.sort((a, b) => {
    const aDate = new Date(a.completedAt || a.createdAt).getTime();
    const bDate = new Date(b.completedAt || b.createdAt).getTime();
    return bDate - aDate;
  });
}

export function getPortalStatusLabel(status: string) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'Completada';
    case 'EXPIRED':
      return 'Expirada';
    case 'PENDING':
    default:
      return 'Pendiente';
  }
}
