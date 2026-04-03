import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getTeamUserIds } from '@/lib/team';

type EvaluationType = 'DISC' | 'DRIVING_FORCES' | 'EQ' | 'DNA' | 'ACUMEN' | 'VALUES' | 'STRESS';

interface CompletedEvaluation {
  type: EvaluationType;
  completedAt: Date;
  token: string;
  resultId?: string;
}

interface PersonWithEvaluations {
  email: string;
  name: string;
  evaluations: CompletedEvaluation[];
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const campaignId = searchParams.get('campaignId');
    const evaluationTypesParam = searchParams.get('evaluationTypes');

    if (!campaignId) {
      return NextResponse.json({ error: 'Se requiere campaignId' }, { status: 400 });
    }

    // Get team user IDs for the current user
    const teamUserIds = await getTeamUserIds(session.user.id);

    // Get the campaign to check required evaluation types
    const campaign = await prisma.selectionCampaign.findFirst({
      where: {
        id: campaignId,
        userId: { in: teamUserIds }
      },
      select: {
        evaluationTypes: true,
        candidates: {
          select: {
            email: true
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
    }

    // Parse evaluation types filter
    const requiredTypes: EvaluationType[] = evaluationTypesParam
      ? evaluationTypesParam.split(',') as EvaluationType[]
      : campaign.evaluationTypes as EvaluationType[];

    // Get existing candidate emails in the campaign
    const existingEmails = new Set(campaign.candidates.map(c => c.email.toLowerCase()));

    // Build search condition
    const searchCondition = query.trim()
      ? {
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' as const } },
            { recipientEmail: { contains: query, mode: 'insensitive' as const } }
          ]
        }
      : {};

    // Fetch completed evaluations from all types
    const peopleMap = new Map<string, PersonWithEvaluations>();

    // DISC Evaluations
    if (requiredTypes.includes('DISC')) {
      const discEvals = await prisma.externalEvaluation.findMany({
        where: {
          senderUserId: { in: teamUserIds },
          status: 'COMPLETED',
          ...searchCondition
        },
        select: {
          recipientEmail: true,
          recipientName: true,
          token: true,
          completedAt: true,
          result: { select: { id: true } }
        },
        orderBy: { completedAt: 'desc' }
      });

      for (const e of discEvals) {
        const email = e.recipientEmail.toLowerCase();
        if (!peopleMap.has(email)) {
          peopleMap.set(email, { email, name: e.recipientName, evaluations: [] });
        }
        const person = peopleMap.get(email)!;
        // Only add if not already added (latest one)
        if (!person.evaluations.some(ev => ev.type === 'DISC')) {
          person.evaluations.push({
            type: 'DISC',
            completedAt: e.completedAt!,
            token: e.token,
            resultId: e.result?.id
          });
        }
        // Update name if newer
        if (e.recipientName) person.name = e.recipientName;
      }
    }

    // Driving Forces Evaluations
    if (requiredTypes.includes('DRIVING_FORCES')) {
      const dfEvals = await prisma.externalDrivingForcesEvaluation.findMany({
        where: {
          senderUserId: { in: teamUserIds },
          status: 'COMPLETED',
          ...searchCondition
        },
        select: {
          recipientEmail: true,
          recipientName: true,
          token: true,
          completedAt: true,
          result: { select: { id: true } }
        },
        orderBy: { completedAt: 'desc' }
      });

      for (const e of dfEvals) {
        const email = e.recipientEmail.toLowerCase();
        if (!peopleMap.has(email)) {
          peopleMap.set(email, { email, name: e.recipientName, evaluations: [] });
        }
        const person = peopleMap.get(email)!;
        if (!person.evaluations.some(ev => ev.type === 'DRIVING_FORCES')) {
          person.evaluations.push({
            type: 'DRIVING_FORCES',
            completedAt: e.completedAt!,
            token: e.token,
            resultId: e.result?.id
          });
        }
        if (e.recipientName) person.name = e.recipientName;
      }
    }

    // EQ Evaluations
    if (requiredTypes.includes('EQ')) {
      const eqEvals = await prisma.externalEQEvaluation.findMany({
        where: {
          senderUserId: { in: teamUserIds },
          status: 'COMPLETED',
          ...searchCondition
        },
        select: {
          recipientEmail: true,
          recipientName: true,
          token: true,
          completedAt: true,
          result: { select: { id: true } }
        },
        orderBy: { completedAt: 'desc' }
      });

      for (const e of eqEvals) {
        const email = e.recipientEmail.toLowerCase();
        if (!peopleMap.has(email)) {
          peopleMap.set(email, { email, name: e.recipientName, evaluations: [] });
        }
        const person = peopleMap.get(email)!;
        if (!person.evaluations.some(ev => ev.type === 'EQ')) {
          person.evaluations.push({
            type: 'EQ',
            completedAt: e.completedAt!,
            token: e.token,
            resultId: e.result?.id
          });
        }
        if (e.recipientName) person.name = e.recipientName;
      }
    }

    // DNA Evaluations
    if (requiredTypes.includes('DNA')) {
      const dnaEvals = await prisma.externalDNAEvaluation.findMany({
        where: {
          senderUserId: { in: teamUserIds },
          status: 'COMPLETED',
          ...searchCondition
        },
        select: {
          recipientEmail: true,
          recipientName: true,
          token: true,
          completedAt: true,
          result: { select: { id: true } }
        },
        orderBy: { completedAt: 'desc' }
      });

      for (const e of dnaEvals) {
        const email = e.recipientEmail.toLowerCase();
        if (!peopleMap.has(email)) {
          peopleMap.set(email, { email, name: e.recipientName, evaluations: [] });
        }
        const person = peopleMap.get(email)!;
        if (!person.evaluations.some(ev => ev.type === 'DNA')) {
          person.evaluations.push({
            type: 'DNA',
            completedAt: e.completedAt!,
            token: e.token,
            resultId: e.result?.id
          });
        }
        if (e.recipientName) person.name = e.recipientName;
      }
    }

    // Acumen Evaluations
    if (requiredTypes.includes('ACUMEN')) {
      const acumenEvals = await prisma.externalAcumenEvaluation.findMany({
        where: {
          senderUserId: { in: teamUserIds },
          status: 'COMPLETED',
          ...searchCondition
        },
        select: {
          recipientEmail: true,
          recipientName: true,
          token: true,
          completedAt: true,
          result: { select: { id: true } }
        },
        orderBy: { completedAt: 'desc' }
      });

      for (const e of acumenEvals) {
        const email = e.recipientEmail.toLowerCase();
        if (!peopleMap.has(email)) {
          peopleMap.set(email, { email, name: e.recipientName, evaluations: [] });
        }
        const person = peopleMap.get(email)!;
        if (!person.evaluations.some(ev => ev.type === 'ACUMEN')) {
          person.evaluations.push({
            type: 'ACUMEN',
            completedAt: e.completedAt!,
            token: e.token,
            resultId: e.result?.id
          });
        }
        if (e.recipientName) person.name = e.recipientName;
      }
    }

    // Values Evaluations
    if (requiredTypes.includes('VALUES')) {
      const valuesEvals = await prisma.externalValuesEvaluation.findMany({
        where: {
          senderUserId: { in: teamUserIds },
          status: 'COMPLETED',
          ...searchCondition
        },
        select: {
          recipientEmail: true,
          recipientName: true,
          token: true,
          completedAt: true,
          result: { select: { id: true } }
        },
        orderBy: { completedAt: 'desc' }
      });

      for (const e of valuesEvals) {
        const email = e.recipientEmail.toLowerCase();
        if (!peopleMap.has(email)) {
          peopleMap.set(email, { email, name: e.recipientName, evaluations: [] });
        }
        const person = peopleMap.get(email)!;
        if (!person.evaluations.some(ev => ev.type === 'VALUES')) {
          person.evaluations.push({
            type: 'VALUES',
            completedAt: e.completedAt!,
            token: e.token,
            resultId: e.result?.id
          });
        }
        if (e.recipientName) person.name = e.recipientName;
      }
    }

    // Stress Evaluations
    if (requiredTypes.includes('STRESS')) {
      const stressEvals = await prisma.externalStressEvaluation.findMany({
        where: {
          senderUserId: { in: teamUserIds },
          status: 'COMPLETED',
          ...searchCondition
        },
        select: {
          recipientEmail: true,
          recipientName: true,
          token: true,
          completedAt: true,
          result: { select: { id: true } }
        },
        orderBy: { completedAt: 'desc' }
      });

      for (const e of stressEvals) {
        const email = e.recipientEmail.toLowerCase();
        if (!peopleMap.has(email)) {
          peopleMap.set(email, { email, name: e.recipientName, evaluations: [] });
        }
        const person = peopleMap.get(email)!;
        if (!person.evaluations.some(ev => ev.type === 'STRESS')) {
          person.evaluations.push({
            type: 'STRESS',
            completedAt: e.completedAt!,
            token: e.token,
            resultId: e.result?.id
          });
        }
        if (e.recipientName) person.name = e.recipientName;
      }
    }

    // Convert to array and filter out people already in campaign
    const people = Array.from(peopleMap.values())
      .filter(p => !existingEmails.has(p.email.toLowerCase()))
      .map(p => ({
        ...p,
        completedCount: p.evaluations.length,
        requiredCount: requiredTypes.length,
        hasAllRequired: p.evaluations.length >= requiredTypes.length,
        missingTypes: requiredTypes.filter(t => !p.evaluations.some(e => e.type === t))
      }))
      .sort((a, b) => b.completedCount - a.completedCount)
      .slice(0, 50); // Limit to 50 results

    return NextResponse.json({
      people,
      campaignEvaluationTypes: campaign.evaluationTypes,
      totalFound: people.length
    });

  } catch (error) {
    console.error('Error searching evaluations:', error);
    return NextResponse.json(
      { error: 'Error al buscar evaluaciones' },
      { status: 500 }
    );
  }
}
