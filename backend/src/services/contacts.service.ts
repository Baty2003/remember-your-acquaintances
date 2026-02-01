import { prisma } from '../lib/prisma.js';

export interface ContactLinkInput {
  type: string;
  label?: string;
  value: string;
}

export interface CreateContactInput {
  name: string;
  gender?: string;
  age?: number;
  ageType?: string;
  height?: number;
  heightType?: string;
  occupation?: string;
  occupationDetails?: string;
  whereMet?: string;
  howMet?: string;
  details?: string;
  metAt?: string;
  tagIds?: string[];
  meetingPlaceId?: string | null;
  links?: ContactLinkInput[];
}

export type UpdateContactInput = Partial<CreateContactInput>;

export interface ContactFilters {
  search?: string;
  tagIds?: string[];
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export const contactsService = {
  async getAll(userId: string, filters?: ContactFilters) {
    const where: Record<string, unknown> = { userId };

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { occupation: { contains: filters.search } },
        { whereMet: { contains: filters.search } },
      ];
    }

    if (filters?.tagIds?.length) {
      where.tags = {
        some: {
          id: { in: filters.tagIds },
        },
      };
    }

    const orderBy: Record<string, string> = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy,
      include: {
        tags: true,
        meetingPlace: true,
        links: true,
      },
    });

    return {
      contacts,
      total: contacts.length,
    };
  },

  async getById(id: string, userId: string) {
    const contact = await prisma.contact.findFirst({
      where: { id, userId },
      include: {
        tags: true,
        meetingPlace: true,
        links: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!contact) {
      throw new Error('Contact not found');
    }

    return contact;
  },

  async create(userId: string, input: CreateContactInput) {
    const { tagIds, meetingPlaceId, links, ...data } = input;

    const contact = await prisma.contact.create({
      data: {
        ...data,
        userId,
        meetingPlaceId: meetingPlaceId || null,
        tags: tagIds?.length
          ? {
              connect: tagIds.map((id) => ({ id })),
            }
          : undefined,
        links: links?.length
          ? {
              create: links.map((link) => ({
                type: link.type,
                label: link.label || null,
                value: link.value,
              })),
            }
          : undefined,
      },
      include: {
        tags: true,
        meetingPlace: true,
        links: true,
      },
    });

    return contact;
  },

  async update(id: string, userId: string, input: UpdateContactInput) {
    // Verify ownership
    const existing = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Contact not found');
    }

    const { tagIds, meetingPlaceId, links, ...data } = input;

    const updateData: Record<string, unknown> = { ...data };

    if (tagIds !== undefined) {
      updateData.tags = { set: tagIds.map((id) => ({ id })) };
    }

    if (meetingPlaceId !== undefined) {
      updateData.meetingPlaceId = meetingPlaceId || null;
    }

    // Handle links: delete all existing and create new ones
    if (links !== undefined) {
      await prisma.contactLink.deleteMany({
        where: { contactId: id },
      });

      if (links.length > 0) {
        await prisma.contactLink.createMany({
          data: links.map((link) => ({
            contactId: id,
            type: link.type,
            label: link.label || null,
            value: link.value,
          })),
        });
      }
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: updateData,
      include: {
        tags: true,
        meetingPlace: true,
        links: true,
      },
    });

    return contact;
  },

  async delete(id: string, userId: string) {
    // Verify ownership
    const existing = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Contact not found');
    }

    await prisma.contact.delete({
      where: { id },
    });

    return { success: true };
  },

  async updatePhoto(id: string, userId: string, photoUrl: string) {
    // Verify ownership
    const existing = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Contact not found');
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { photo: photoUrl },
      include: {
        tags: true,
        meetingPlace: true,
        links: true,
      },
    });

    return contact;
  },

  async deletePhoto(id: string, userId: string) {
    // Verify ownership
    const existing = await prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Contact not found');
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { photo: null },
      include: {
        tags: true,
        meetingPlace: true,
        links: true,
      },
    });

    return contact;
  },
};
