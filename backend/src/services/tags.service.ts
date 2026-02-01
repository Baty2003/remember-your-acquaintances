import { prisma } from '../lib/prisma.js';

export interface CreateTagInput {
  name: string;
}

export const tagsService = {
  async getAll(userId: string) {
    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return { tags };
  },

  async create(userId: string, input: CreateTagInput) {
    // Check if tag already exists for this user
    const existing = await prisma.tag.findFirst({
      where: { userId, name: input.name },
    });

    if (existing) {
      throw new Error('Tag already exists');
    }

    const tag = await prisma.tag.create({
      data: {
        name: input.name,
        userId,
      },
    });

    return tag;
  },

  async update(id: string, userId: string, input: CreateTagInput) {
    // Verify ownership
    const existing = await prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Tag not found');
    }

    // Check if another tag with the same name exists
    const duplicate = await prisma.tag.findFirst({
      where: { userId, name: input.name, NOT: { id } },
    });

    if (duplicate) {
      throw new Error('Tag already exists');
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: { name: input.name },
    });

    return tag;
  },

  async delete(id: string, userId: string) {
    // Verify ownership and check usage
    const existing = await prisma.tag.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    if (!existing) {
      throw new Error('Tag not found');
    }

    if (existing._count.contacts > 0) {
      throw new Error(`Cannot delete tag: it is used by ${existing._count.contacts} contact(s)`);
    }

    await prisma.tag.delete({
      where: { id },
    });

    return { success: true };
  },
};
