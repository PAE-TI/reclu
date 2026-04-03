import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase().trim() || '';
  
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Search across all evaluation types (both PENDING and COMPLETED)
    const [disc, drivingForces, eq, dna, acumen, values, stress, technical] = await Promise.all([
      // DISC evaluations
      prisma.externalEvaluation.findMany({
        where: {
          senderUserId: session.user.id,
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' } },
            { recipientEmail: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          token: true,
          recipientName: true,
          recipientEmail: true,
          status: true,
          createdAt: true,
          completedAt: true,
          result: {
            select: {
              primaryStyle: true,
              secondaryStyle: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      // Driving Forces evaluations
      prisma.externalDrivingForcesEvaluation.findMany({
        where: {
          senderUserId: session.user.id,
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' } },
            { recipientEmail: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          token: true,
          recipientName: true,
          recipientEmail: true,
          status: true,
          createdAt: true,
          completedAt: true,
          result: {
            select: {
              topMotivator: true,
              secondMotivator: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      // EQ evaluations
      prisma.externalEQEvaluation.findMany({
        where: {
          senderUserId: session.user.id,
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' } },
            { recipientEmail: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          token: true,
          recipientName: true,
          recipientEmail: true,
          status: true,
          createdAt: true,
          completedAt: true,
          result: {
            select: {
              totalEQPercentile: true,
              eqLevel: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      // DNA evaluations
      prisma.externalDNAEvaluation.findMany({
        where: {
          senderUserId: session.user.id,
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' } },
            { recipientEmail: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          token: true,
          recipientName: true,
          recipientEmail: true,
          status: true,
          createdAt: true,
          completedAt: true,
          result: {
            select: {
              totalDNAPercentile: true,
              dnaLevel: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      // Acumen evaluations
      prisma.externalAcumenEvaluation.findMany({
        where: {
          senderUserId: session.user.id,
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' } },
            { recipientEmail: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          token: true,
          recipientName: true,
          recipientEmail: true,
          status: true,
          createdAt: true,
          completedAt: true,
          result: {
            select: {
              totalAcumenScore: true,
              acumenLevel: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      // Values evaluations
      prisma.externalValuesEvaluation.findMany({
        where: {
          senderUserId: session.user.id,
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' } },
            { recipientEmail: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          token: true,
          recipientName: true,
          recipientEmail: true,
          status: true,
          createdAt: true,
          completedAt: true,
          result: {
            select: {
              consistencyScore: true,
              authenticityScore: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      // Stress evaluations
      prisma.externalStressEvaluation.findMany({
        where: {
          senderUserId: session.user.id,
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' } },
            { recipientEmail: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          token: true,
          recipientName: true,
          recipientEmail: true,
          status: true,
          createdAt: true,
          completedAt: true,
          result: {
            select: {
              indiceResiliencia: true,
              resilienceLevel: true,
              nivelEstresGeneral: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      }),
      // Technical evaluations
      prisma.externalTechnicalEvaluation.findMany({
        where: {
          senderUserId: session.user.id,
          OR: [
            { recipientName: { contains: query, mode: 'insensitive' } },
            { recipientEmail: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          token: true,
          recipientName: true,
          recipientEmail: true,
          status: true,
          createdAt: true,
          completedAt: true,
          jobPositionId: true,
          result: {
            select: {
              totalScore: true,
              performanceLevel: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      })
    ]);

    // Format results into categories
    const results = {
      people: [] as any[],
      evaluations: [] as any[]
    };

    // Create unique people map
    const peopleMap = new Map<string, any>();
    
    // Process all evaluations to extract unique people
    const allEvaluations = [
      ...disc.map((e: any) => ({ ...e, type: 'DISC', typeKey: 'disc', color: 'indigo', icon: 'Target' })),
      ...drivingForces.map((e: any) => ({ ...e, type: 'Fuerzas Motivadoras', typeKey: 'driving-forces', color: 'purple', icon: 'Flame' })),
      ...eq.map((e: any) => ({ ...e, type: 'Inteligencia Emocional', typeKey: 'eq', color: 'pink', icon: 'Heart' })),
      ...dna.map((e: any) => ({ ...e, type: 'DNA-25', typeKey: 'dna', color: 'teal', icon: 'Dna' })),
      ...acumen.map((e: any) => ({ ...e, type: 'Acumen', typeKey: 'acumen', color: 'amber', icon: 'Compass' })),
      ...values.map((e: any) => ({ ...e, type: 'Valores', typeKey: 'values', color: 'violet', icon: 'Shield' })),
      ...stress.map((e: any) => ({ ...e, type: 'Estrés y Resiliencia', typeKey: 'stress', color: 'orange', icon: 'Activity' })),
      ...technical.map((e: any) => ({ ...e, type: 'Técnica', typeKey: 'technical', color: 'sky', icon: 'FileCode' }))
    ];

    allEvaluations.forEach(evaluation => {
      const email = evaluation.recipientEmail.toLowerCase();
      const existing = peopleMap.get(email);
      
      if (!existing) {
        peopleMap.set(email, {
          name: evaluation.recipientName,
          email: evaluation.recipientEmail,
          evaluations: [evaluation.type],
          completedCount: evaluation.status === 'COMPLETED' ? 1 : 0,
          pendingCount: evaluation.status === 'PENDING' ? 1 : 0,
          latestDate: evaluation.createdAt
        });
      } else {
        if (!existing.evaluations.includes(evaluation.type)) {
          existing.evaluations.push(evaluation.type);
        }
        if (evaluation.status === 'COMPLETED') {
          existing.completedCount++;
        } else if (evaluation.status === 'PENDING') {
          existing.pendingCount++;
        }
        if (evaluation.createdAt && (!existing.latestDate || evaluation.createdAt > existing.latestDate)) {
          existing.latestDate = evaluation.createdAt;
        }
      }
    });

    // Convert people map to array and sort by latest date
    results.people = Array.from(peopleMap.values())
      .sort((a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime())
      .slice(0, 5);

    // Add evaluation results with details - completed first, then pending
    results.evaluations = allEvaluations
      .sort((a, b) => {
        // Completed first
        if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return -1;
        if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return 1;
        // Then by date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .map(e => ({
        id: e.id,
        token: e.token,
        type: e.type,
        typeKey: e.typeKey,
        color: e.color,
        icon: e.icon,
        recipientName: e.recipientName,
        recipientEmail: e.recipientEmail,
        status: e.status,
        createdAt: e.createdAt,
        completedAt: e.completedAt,
        summary: getSummary(e)
      }))
      .slice(0, 12);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Error en la búsqueda' }, { status: 500 });
  }
}

function getSummary(evaluation: any): string {
  if (evaluation.status === 'PENDING') {
    return 'Pendiente de respuesta';
  }
  
  const result = evaluation.result;
  if (!result) return 'Completada';
  
  switch (evaluation.type) {
    case 'DISC':
      return result.primaryStyle ? `Estilo: ${result.primaryStyle}` : 'Completada';
    case 'Fuerzas Motivadoras':
      return result.topMotivator ? `Motivador: ${result.topMotivator}` : 'Completada';
    case 'Inteligencia Emocional':
      return result.eqLevel ? `Nivel EQ: ${result.eqLevel}` : 'Completada';
    case 'DNA-25':
      return result.dnaLevel ? `Nivel: ${result.dnaLevel}` : 'Completada';
    case 'Acumen':
      return result.acumenLevel ? `Nivel: ${result.acumenLevel}` : 'Completada';
    case 'Valores':
      return result.consistencyScore ? `Consistencia: ${Math.round(result.consistencyScore)}%` : 'Completada';
    case 'Estrés y Resiliencia':
      return result.resilienceLevel ? `Resiliencia: ${result.resilienceLevel}` : 'Completada';
    case 'Técnica':
      return result.totalScore !== undefined ? `Puntuación: ${Math.round(result.totalScore)}%` : 'Completada';
    default:
      return 'Completada';
  }
}
