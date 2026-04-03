import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ProfileClient from './profile-client';
import { getFacilitatorInfo } from '@/lib/team';

export const dynamic = 'force-dynamic';

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      company: true,
      jobTitle: true,
      role: true,
      createdAt: true,
      ownerId: true,
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const memberSince = format(new Date(user.createdAt), "dd 'de' MMMM, yyyy", { locale: es });

  // Get facilitator info if applicable
  const facilitatorInfo = await getFacilitatorInfo(session.user.id);

  // Get team members (only for non-facilitators / owners)
  let teamMembers: any[] = [];
  if (!user.ownerId) {
    // User is an owner, get their team members
    const teamData = await prisma.teamMember.findMany({
      where: { ownerId: session.user.id },
      include: {
        facilitator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isActive: true,
            createdAt: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Count evaluations for each facilitator
    for (const member of teamData) {
      if (member.facilitatorId) {
        const evalCounts = await prisma.$transaction([
          prisma.externalEvaluation.count({ where: { senderUserId: member.facilitatorId } }),
          prisma.externalDrivingForcesEvaluation.count({ where: { senderUserId: member.facilitatorId } }),
          prisma.externalEQEvaluation.count({ where: { senderUserId: member.facilitatorId } }),
          prisma.externalDNAEvaluation.count({ where: { senderUserId: member.facilitatorId } }),
          prisma.externalAcumenEvaluation.count({ where: { senderUserId: member.facilitatorId } }),
          prisma.externalValuesEvaluation.count({ where: { senderUserId: member.facilitatorId } }),
          prisma.externalStressEvaluation.count({ where: { senderUserId: member.facilitatorId } }),
        ]);
        const totalEvaluations = evalCounts.reduce((a, b) => a + b, 0);
        
        teamMembers.push({
          ...member,
          totalEvaluations,
          memberSince: member.facilitator?.createdAt 
            ? format(new Date(member.facilitator.createdAt), "dd MMM yyyy", { locale: es })
            : null,
        });
      } else {
        teamMembers.push({
          ...member,
          totalEvaluations: 0,
          memberSince: null,
        });
      }
    }
  }

  return (
    <ProfileClient 
      user={{
        ...user,
        memberSince,
      }}
      facilitatorInfo={facilitatorInfo}
      teamMembers={teamMembers}
    />
  );
}
