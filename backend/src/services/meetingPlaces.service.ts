import { prisma } from '../lib/prisma.js';

export interface CreateMeetingPlaceInput {
  name: string;
}

export const meetingPlacesService = {
  async getAll(userId: string) {
    const meetingPlaces = await prisma.meetingPlace.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return { meetingPlaces };
  },

  async create(userId: string, input: CreateMeetingPlaceInput) {
    // Check if meeting place already exists for this user
    const existing = await prisma.meetingPlace.findFirst({
      where: { userId, name: input.name },
    });

    if (existing) {
      throw new Error('Meeting place already exists');
    }

    const meetingPlace = await prisma.meetingPlace.create({
      data: {
        name: input.name,
        userId,
      },
    });

    return meetingPlace;
  },

  async update(id: string, userId: string, input: CreateMeetingPlaceInput) {
    // Verify ownership
    const existing = await prisma.meetingPlace.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Meeting place not found');
    }

    // Check if another meeting place with the same name exists
    const duplicate = await prisma.meetingPlace.findFirst({
      where: { userId, name: input.name, NOT: { id } },
    });

    if (duplicate) {
      throw new Error('Meeting place already exists');
    }

    const meetingPlace = await prisma.meetingPlace.update({
      where: { id },
      data: { name: input.name },
    });

    return meetingPlace;
  },

  async delete(id: string, userId: string) {
    // Verify ownership and check usage
    const existing = await prisma.meetingPlace.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    if (!existing) {
      throw new Error('Meeting place not found');
    }

    if (existing._count.contacts > 0) {
      throw new Error(
        `Cannot delete meeting place: it is used by ${existing._count.contacts} contact(s)`
      );
    }

    await prisma.meetingPlace.delete({
      where: { id },
    });

    return { success: true };
  },
};
