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
  birthDate?: string;
  height?: number;
  heightType?: string;
  occupation?: string;
  occupationDetails?: string;
  residence?: string;
  residenceDetails?: string;
  whereMet?: string;
  howMet?: string;
  details?: string;
  customFields?: Record<string, string>;
  metAt?: string;
  tagIds?: string[];
  meetingPlaceId?: string | null;
  links?: ContactLinkInput[];
}

export type UpdateContactInput = Partial<CreateContactInput>;

export interface ContactFilters {
  search?: string;
  tagIds?: string[];
  meetingPlaceIds?: string[];
  gender?: 'male' | 'female';
  hasContact?: boolean;
  metAtFrom?: string;
  metAtTo?: string;
  sortBy?:
    | 'name'
    | 'createdAt'
    | 'updatedAt'
    | 'metAt'
    | 'age'
    | 'gender'
    | 'height'
    | 'occupation'
    | 'meetingPlace';
  sortOrder?: 'asc' | 'desc';
}

export interface ContactImportItem {
  name: string;
  gender?: string;
  age?: number;
  ageType?: string;
  birthDate?: string;
  height?: number;
  heightType?: string;
  occupation?: string;
  occupationDetails?: string;
  residence?: string;
  residenceDetails?: string;
  whereMet?: string;
  howMet?: string;
  details?: string;
  metAt?: string;
  tags?: string[]; // Tag names
  meetingPlace?: string; // Meeting place name
  links?: ContactLinkInput[];
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export const contactsService = {
  async getAll(userId: string, filters?: ContactFilters) {
    const where: Record<string, unknown> = { userId };

    if (filters?.search) {
      // Note: SQLite doesn't support mode: 'insensitive', but LIKE is case-insensitive by default
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

    if (filters?.meetingPlaceIds?.length) {
      where.meetingPlaceId = { in: filters.meetingPlaceIds };
    }

    if (filters?.gender) {
      where.gender = filters.gender;
    }

    if (filters?.hasContact) {
      where.links = {
        some: {
          type: { in: ['phone', 'telegram', 'instagram'] },
        },
      };
    }

    if (filters?.metAtFrom || filters?.metAtTo) {
      where.metAt = {};
      if (filters.metAtFrom) {
        (where.metAt as Record<string, unknown>).gte = new Date(filters.metAtFrom);
      }
      if (filters.metAtTo) {
        (where.metAt as Record<string, unknown>).lte = new Date(filters.metAtTo);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sortBy) {
      const sortOrder = filters.sortOrder || 'asc';
      if (filters.sortBy === 'meetingPlace') {
        orderBy = { meetingPlace: { name: sortOrder } };
      } else {
        orderBy = { [filters.sortBy]: sortOrder };
      }
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

  async deleteAll(userId: string) {
    const result = await prisma.contact.deleteMany({
      where: { userId },
    });

    return { success: true, deleted: result.count };
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

  async importMany(userId: string, contacts: ContactImportItem[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Pre-fetch existing tags and meeting places for this user (optimization)
    const existingTags = await prisma.tag.findMany({
      where: { userId },
      select: { id: true, name: true },
    });
    const tagMap = new Map<string, string>(
      existingTags.map((t: { id: string; name: string }) => [t.name.toLowerCase(), t.id])
    );

    const existingPlaces = await prisma.meetingPlace.findMany({
      where: { userId },
      select: { id: true, name: true },
    });
    const placeMap = new Map<string, string>(
      existingPlaces.map((p: { id: string; name: string }) => [p.name.toLowerCase(), p.id])
    );

    // Helper: find or create tag
    const resolveTag = async (tagName: string): Promise<string> => {
      const key = tagName.toLowerCase();
      if (tagMap.has(key)) {
        return tagMap.get(key)!;
      }
      const created = await prisma.tag.create({
        data: { userId, name: tagName },
      });
      tagMap.set(key, created.id);
      return created.id;
    };

    // Helper: find or create meeting place
    const resolveMeetingPlace = async (placeName: string): Promise<string> => {
      const key = placeName.toLowerCase();
      if (placeMap.has(key)) {
        return placeMap.get(key)!;
      }
      const created = await prisma.meetingPlace.create({
        data: { userId, name: placeName },
      });
      placeMap.set(key, created.id);
      return created.id;
    };

    // Process each contact
    for (const item of contacts) {
      try {
        // Validate required field
        if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
          throw new Error('Name is required');
        }

        // Resolve tags (names → IDs)
        const tagIds: string[] = [];
        if (item.tags && item.tags.length > 0) {
          for (const tagName of item.tags) {
            if (tagName && tagName.trim()) {
              const tagId = await resolveTag(tagName.trim());
              tagIds.push(tagId);
            }
          }
        }

        // Resolve meeting place (name → ID)
        let meetingPlaceId: string | null = null;
        if (item.meetingPlace && item.meetingPlace.trim()) {
          meetingPlaceId = await resolveMeetingPlace(item.meetingPlace.trim());
        }

        // Create the contact
        await prisma.contact.create({
          data: {
            userId,
            name: item.name.trim(),
            gender: item.gender || null,
            age: item.age || null,
            ageType: item.ageType || null,
            birthDate: item.birthDate ? new Date(item.birthDate) : null,
            height: item.height || null,
            heightType: item.heightType || null,
            occupation: item.occupation || null,
            occupationDetails: item.occupationDetails || null,
            residence: item.residence || null,
            residenceDetails: item.residenceDetails || null,
            whereMet: item.whereMet || null,
            howMet: item.howMet || null,
            details: item.details || null,
            metAt: item.metAt ? new Date(item.metAt) : new Date(),
            meetingPlaceId,
            tags: tagIds.length > 0 ? { connect: tagIds.map((id) => ({ id })) } : undefined,
            links:
              item.links && item.links.length > 0
                ? {
                    create: item.links.map((link) => ({
                      type: link.type,
                      label: link.label || null,
                      value: link.value,
                    })),
                  }
                : undefined,
          },
        });

        result.success++;
      } catch (error) {
        result.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Failed to import "${item.name || 'unnamed'}": ${errorMessage}`);
      }
    }

    return result;
  },
};
