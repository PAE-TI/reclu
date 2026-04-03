import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getTeamUserIds } from '@/lib/team';
import DashboardClient from '@/components/dashboard-client';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Get team user IDs (for FULL_ACCESS facilitators, this includes owner + all facilitators)
  const teamUserIds = await getTeamUserIds(session.user.id);

  // Fetch evaluations from all team members
  const [
    discEvaluations,
    fmEvaluations,
    eqEvaluations,
    dnaEvaluations,
    acumenEvaluations,
    valuesEvaluations,
    stressEvaluations,
    technicalEvaluations,
  ] = await Promise.all([
    prisma.externalEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      orderBy: { createdAt: 'desc' },
      include: { result: true, responses: true },
    }),
    prisma.externalDrivingForcesEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      orderBy: { createdAt: 'desc' },
      include: { result: true, responses: true },
    }),
    prisma.externalEQEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      orderBy: { createdAt: 'desc' },
      include: { result: true, responses: true },
    }),
    prisma.externalDNAEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      orderBy: { createdAt: 'desc' },
      include: { result: true, responses: true },
    }),
    prisma.externalAcumenEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      orderBy: { createdAt: 'desc' },
      include: { result: true, responses: true },
    }),
    prisma.externalValuesEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      orderBy: { createdAt: 'desc' },
      include: { result: true, responses: true },
    }),
    prisma.externalStressEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      orderBy: { createdAt: 'desc' },
      include: { result: true, responses: true },
    }),
    prisma.externalTechnicalEvaluation.findMany({
      where: { senderUserId: { in: teamUserIds } },
      orderBy: { createdAt: 'desc' },
      include: { result: true, responses: true },
    }),
  ]);

  // Estadísticas de evaluaciones DISC enviadas
  const totalDiscEvaluations = discEvaluations.length;
  const completedDiscEvaluations = discEvaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingDiscEvaluations = discEvaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredDiscEvaluations = discEvaluations.filter(e => e.status === 'PENDING' && new Date() > new Date(e.tokenExpiry)).length;

  // Estadísticas de evaluaciones FM enviadas
  const totalFmEvaluations = fmEvaluations.length;
  const completedFmEvaluations = fmEvaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingFmEvaluations = fmEvaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredFmEvaluations = fmEvaluations.filter(e => e.status === 'PENDING' && new Date() > new Date(e.tokenExpiry)).length;

  // Estadísticas de evaluaciones EQ enviadas
  const totalEqEvaluations = eqEvaluations.length;
  const completedEqEvaluations = eqEvaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingEqEvaluations = eqEvaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredEqEvaluations = eqEvaluations.filter(e => e.status === 'PENDING' && new Date() > new Date(e.tokenExpiry)).length;

  // Estadísticas de evaluaciones DNA-25 enviadas
  const totalDnaEvaluations = dnaEvaluations.length;
  const completedDnaEvaluations = dnaEvaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingDnaEvaluations = dnaEvaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredDnaEvaluations = dnaEvaluations.filter(e => e.status === 'PENDING' && new Date() > new Date(e.tokenExpiry)).length;

  // Estadísticas de evaluaciones Acumen enviadas
  const totalAcumenEvaluations = acumenEvaluations.length;
  const completedAcumenEvaluations = acumenEvaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingAcumenEvaluations = acumenEvaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredAcumenEvaluations = acumenEvaluations.filter(e => e.status === 'PENDING' && new Date() > new Date(e.tokenExpiry)).length;

  // Estadísticas de evaluaciones Values enviadas
  const totalValuesEvaluations = valuesEvaluations.length;
  const completedValuesEvaluations = valuesEvaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingValuesEvaluations = valuesEvaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredValuesEvaluations = valuesEvaluations.filter(e => e.status === 'PENDING' && new Date() > new Date(e.tokenExpiry)).length;

  // Estadísticas de evaluaciones Stress enviadas
  const totalStressEvaluations = stressEvaluations.length;
  const completedStressEvaluations = stressEvaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingStressEvaluations = stressEvaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredStressEvaluations = stressEvaluations.filter(e => e.status === 'PENDING' && new Date() > new Date(e.tokenExpiry)).length;

  // Estadísticas de evaluaciones Técnicas enviadas
  const totalTechnicalEvaluations = technicalEvaluations.length;
  const completedTechnicalEvaluations = technicalEvaluations.filter(e => e.status === 'COMPLETED').length;
  const pendingTechnicalEvaluations = technicalEvaluations.filter(e => e.status === 'PENDING' && new Date() <= new Date(e.tokenExpiry)).length;
  const expiredTechnicalEvaluations = technicalEvaluations.filter(e => e.status === 'PENDING' && new Date() > new Date(e.tokenExpiry)).length;

  // Total de personas evaluadas (personas únicas)
  const uniqueEmails = new Set([
    ...discEvaluations.map(e => e.recipientEmail),
    ...fmEvaluations.map(e => e.recipientEmail),
    ...eqEvaluations.map(e => e.recipientEmail),
    ...dnaEvaluations.map(e => e.recipientEmail),
    ...acumenEvaluations.map(e => e.recipientEmail),
    ...valuesEvaluations.map(e => e.recipientEmail),
    ...stressEvaluations.map(e => e.recipientEmail),
    ...technicalEvaluations.map(e => e.recipientEmail)
  ]);
  const totalPeopleEvaluated = uniqueEmails.size;

  // Evaluaciones recientes
  const recentDiscEvaluations = discEvaluations.slice(0, 5);
  const recentFmEvaluations = fmEvaluations.slice(0, 5);
  const recentEqEvaluations = eqEvaluations.slice(0, 5);
  const recentDnaEvaluations = dnaEvaluations.slice(0, 5);
  const recentAcumenEvaluations = acumenEvaluations.slice(0, 5);
  const recentValuesEvaluations = valuesEvaluations.slice(0, 5);
  const recentStressEvaluations = stressEvaluations.slice(0, 5);
  const recentTechnicalEvaluations = technicalEvaluations.slice(0, 5);

  // Personas con evaluaciones completadas
  const completedDiscEmails = new Set(discEvaluations.filter(e => e.status === 'COMPLETED').map(e => e.recipientEmail));
  const completedFmEmails = new Set(fmEvaluations.filter(e => e.status === 'COMPLETED').map(e => e.recipientEmail));
  const completedEqEmails = new Set(eqEvaluations.filter(e => e.status === 'COMPLETED').map(e => e.recipientEmail));
  const completedDnaEmails = new Set(dnaEvaluations.filter(e => e.status === 'COMPLETED').map(e => e.recipientEmail));
  const completedAcumenEmails = new Set(acumenEvaluations.filter(e => e.status === 'COMPLETED').map(e => e.recipientEmail));
  const completedValuesEmails = new Set(valuesEvaluations.filter(e => e.status === 'COMPLETED').map(e => e.recipientEmail));
  const completedStressEmails = new Set(stressEvaluations.filter(e => e.status === 'COMPLETED').map(e => e.recipientEmail));
  const completedTechnicalEmails = new Set(technicalEvaluations.filter(e => e.status === 'COMPLETED').map(e => e.recipientEmail));
  const peopleWithBothCompleted = [...completedDiscEmails].filter(email => completedFmEmails.has(email)).length;
  const peopleWithTripleCompleted = [...completedDiscEmails].filter(email => completedFmEmails.has(email) && completedEqEmails.has(email)).length;
  const peopleWithFullProfile = [...completedDiscEmails].filter(email => completedFmEmails.has(email) && completedEqEmails.has(email) && completedDnaEmails.has(email)).length;
  const peopleWithCompleteMotivaIQ = [...completedDiscEmails].filter(email => completedFmEmails.has(email) && completedEqEmails.has(email) && completedDnaEmails.has(email) && completedAcumenEmails.has(email)).length;
  const peopleWithSixModules = [...completedDiscEmails].filter(email => completedFmEmails.has(email) && completedEqEmails.has(email) && completedDnaEmails.has(email) && completedAcumenEmails.has(email) && completedValuesEmails.has(email)).length;
  const peopleWithFullMotivaIQ = [...completedDiscEmails].filter(email => completedFmEmails.has(email) && completedEqEmails.has(email) && completedDnaEmails.has(email) && completedAcumenEmails.has(email) && completedValuesEmails.has(email) && completedStressEmails.has(email)).length;

  // Totales calculados (incluyendo técnicas)
  const totalEvaluations = totalDiscEvaluations + totalFmEvaluations + totalEqEvaluations + totalDnaEvaluations + totalAcumenEvaluations + totalValuesEvaluations + totalStressEvaluations + totalTechnicalEvaluations;
  const totalCompleted = completedDiscEvaluations + completedFmEvaluations + completedEqEvaluations + completedDnaEvaluations + completedAcumenEvaluations + completedValuesEvaluations + completedStressEvaluations + completedTechnicalEvaluations;
  const totalPending = pendingDiscEvaluations + pendingFmEvaluations + pendingEqEvaluations + pendingDnaEvaluations + pendingAcumenEvaluations + pendingValuesEvaluations + pendingStressEvaluations + pendingTechnicalEvaluations;
  const totalExpired = expiredDiscEvaluations + expiredFmEvaluations + expiredEqEvaluations + expiredDnaEvaluations + expiredAcumenEvaluations + expiredValuesEvaluations + expiredStressEvaluations + expiredTechnicalEvaluations;
  const completionRate = totalEvaluations > 0 ? Math.round((totalCompleted / totalEvaluations) * 100) : 0;

  // Preparar actividad reciente para el componente cliente
  const allRecentActivity = [
    ...discEvaluations.slice(0, 3).map(e => ({ type: 'DISC', name: e.recipientName, email: e.recipientEmail, status: e.status, date: e.createdAt.toISOString(), tokenExpiry: e.tokenExpiry.toISOString() })),
    ...fmEvaluations.slice(0, 3).map(e => ({ type: 'DF', name: e.recipientName, email: e.recipientEmail, status: e.status, date: e.createdAt.toISOString(), tokenExpiry: e.tokenExpiry.toISOString() })),
    ...eqEvaluations.slice(0, 2).map(e => ({ type: 'EQ', name: e.recipientName, email: e.recipientEmail, status: e.status, date: e.createdAt.toISOString(), tokenExpiry: e.tokenExpiry.toISOString() })),
    ...dnaEvaluations.slice(0, 2).map(e => ({ type: 'DNA', name: e.recipientName, email: e.recipientEmail, status: e.status, date: e.createdAt.toISOString(), tokenExpiry: e.tokenExpiry.toISOString() })),
    ...acumenEvaluations.slice(0, 2).map(e => ({ type: 'ACI', name: e.recipientName, email: e.recipientEmail, status: e.status, date: e.createdAt.toISOString(), tokenExpiry: e.tokenExpiry.toISOString() })),
    ...valuesEvaluations.slice(0, 2).map(e => ({ type: 'VALUES', name: e.recipientName, email: e.recipientEmail, status: e.status, date: e.createdAt.toISOString(), tokenExpiry: e.tokenExpiry.toISOString() })),
    ...stressEvaluations.slice(0, 2).map(e => ({ type: 'STRESS', name: e.recipientName, email: e.recipientEmail, status: e.status, date: e.createdAt.toISOString(), tokenExpiry: e.tokenExpiry.toISOString() })),
    ...technicalEvaluations.slice(0, 3).map(e => ({ type: 'TECHNICAL', name: e.recipientName, email: e.recipientEmail, status: e.status, date: e.createdAt.toISOString(), tokenExpiry: e.tokenExpiry.toISOString() })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const stats = {
    totalEvaluations,
    totalCompleted,
    totalPending,
    totalExpired,
    totalPeopleEvaluated,
    completionRate,
    peopleWithFullMotivaIQ,
    recentActivity: allRecentActivity,
    // Technical evaluations specific stats
    technicalTotal: totalTechnicalEvaluations,
    technicalCompleted: completedTechnicalEvaluations,
    technicalPending: pendingTechnicalEvaluations,
  };

  return <DashboardClient stats={stats} />;
}