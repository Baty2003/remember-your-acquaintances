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

  async delete(id: string, userId: string) {
    // Verify ownership
    const existing = await prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Tag not found');
    }

    await prisma.tag.delete({
      where: { id },
    });

    return { success: true };
  },
};
