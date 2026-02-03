import { prisma } from '../lib/prisma.js';

export interface CreateNoteInput {
  title: string;
  description: string;
}

export interface UpdateNoteInput {
  title?: string;
  description?: string;
}

export const notesService = {
  async create(contactId: string, userId: string, input: CreateNoteInput) {
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!contact) {
      throw new Error('Contact not found');
    }

    const note = await prisma.note.create({
      data: {
        contactId,
        title: input.title.trim(),
        description: input.description.trim(),
      },
    });

    return note;
  },

  async update(contactId: string, noteId: string, userId: string, input: UpdateNoteInput) {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        contactId,
        contact: { userId },
      },
    });

    if (!note) {
      throw new Error('Note not found');
    }

    const data: { title?: string; description?: string } = {};
    if (input.title !== undefined) data.title = input.title.trim();
    if (input.description !== undefined) data.description = input.description.trim();

    return prisma.note.update({
      where: { id: noteId },
      data,
    });
  },

  async delete(contactId: string, noteId: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        contactId,
        contact: { userId },
      },
    });

    if (!note) {
      throw new Error('Note not found');
    }

    await prisma.note.delete({
      where: { id: noteId },
    });
  },
};
