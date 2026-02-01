import { prisma } from '../lib/prisma.js';

export interface UserStats {
  totalContacts: number;
  totalTags: number;
  totalMeetingPlaces: number;
  totalNotes: number;
  recentContacts: number; // contacts added in last 30 days
}

export const statsService = {
  async getUserStats(userId: string): Promise<UserStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalContacts, totalTags, totalMeetingPlaces, totalNotes, recentContacts] =
      await Promise.all([
        prisma.contact.count({ where: { userId } }),
        prisma.tag.count({ where: { userId } }),
        prisma.meetingPlace.count({ where: { userId } }),
        prisma.note.count({
          where: { contact: { userId } },
        }),
        prisma.contact.count({
          where: {
            userId,
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
      ]);

    return {
      totalContacts,
      totalTags,
      totalMeetingPlaces,
      totalNotes,
      recentContacts,
    };
  },
};
