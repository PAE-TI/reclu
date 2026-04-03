import { prisma } from './db';

/**
 * Get team user IDs for a user based on their role and access level.
 * For facilitators with FULL_ACCESS: returns owner + all facilitators of owner
 * For owner: returns owner + all facilitators
 * For facilitators with OWN_EVALUATIONS: returns only their own ID
 * For regular users: returns only their own ID
 */
export async function getTeamUserIds(userId: string): Promise<string[]> {
  // Get user with their team membership info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberOf: true, // TeamMember entry if this user is a facilitator
      facilitators: { // All users who are facilitators of this owner
        include: {
          memberOf: true,
        },
      },
    },
  });

  if (!user) {
    return [userId];
  }

  // Check if user is a facilitator
  if (user.memberOf) {
    // User is a facilitator
    if (user.memberOf.accessLevel === 'FULL_ACCESS') {
      // Get owner and all their facilitators
      const ownerId = user.memberOf.ownerId;
      const owner = await prisma.user.findUnique({
        where: { id: ownerId },
        include: {
          facilitators: {
            select: { id: true },
          },
        },
      });

      if (owner) {
        // Return owner + all facilitators (including this user)
        const facilitatorIds = owner.facilitators.map(f => f.id);
        return [ownerId, ...facilitatorIds];
      }
    }
    // OWN_EVALUATIONS - only their own
    return [userId];
  }

  // User is an owner - get all facilitators
  const facilitatorIds = user.facilitators.map(f => f.id);
  return [userId, ...facilitatorIds];
}

/**
 * Get facilitator info including owner details and assigned name
 */
export async function getFacilitatorInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberOf: {
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              company: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.memberOf) {
    return null;
  }

  return {
    isFacilitator: true,
    accessLevel: user.memberOf.accessLevel,
    jobTitle: user.memberOf.jobTitle,
    assignedName: user.memberOf.name, // Name assigned by owner when inviting
    invitedAt: user.memberOf.invitedAt,
    owner: {
      id: user.memberOf.owner.id,
      name: `${user.memberOf.owner.firstName || ''} ${user.memberOf.owner.lastName || ''}`.trim(),
      email: user.memberOf.owner.email,
      company: user.memberOf.owner.company,
    },
  };
}

/**
 * Check if user is owner or facilitator with full access
 */
export async function hasFullTeamAccess(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberOf: true,
    },
  });

  if (!user) return false;

  // Owner always has full access
  if (!user.memberOf) return true;

  // Facilitator with FULL_ACCESS
  return user.memberOf.accessLevel === 'FULL_ACCESS';
}

/**
 * Check if a user can access an evaluation sent by another team member.
 * Returns true if:
 * - The user is the sender of the evaluation
 * - The user is an owner and the sender is their facilitator
 * - The user is a facilitator with FULL_ACCESS and the sender is in their team
 */
export async function canAccessTeamEvaluation(userId: string, senderUserId: string): Promise<boolean> {
  // If user is the sender, always allow
  if (userId === senderUserId) {
    return true;
  }

  // Get the list of user IDs this user has access to
  const accessibleUserIds = await getTeamUserIds(userId);
  
  // Check if the sender is in the accessible list
  return accessibleUserIds.includes(senderUserId);
}
