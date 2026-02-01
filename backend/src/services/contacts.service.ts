import { prisma } from '../lib/prisma.js';

export interface CreateContactInput {
  name: string;
  age?: number;
  ageType?: string;
  height?: string;
  occupation?: string;
  occupationDetails?: string;
  whereMet?: string;
  howMet?: string;
  tagIds?: string[];
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
    const { tagIds, ...data } = input;

    const contact = await prisma.contact.create({
      data: {
        ...data,
        userId,
        tags: tagIds?.length
          ? {
              connect: tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        tags: true,
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

    const { tagIds, ...data } = input;

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...data,
        tags:
          tagIds !== undefined
            ? {
                set: tagIds.map((id) => ({ id })),
              }
            : undefined,
      },
      include: {
        tags: true,
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
      },
    });

    return contact;
  },
};
