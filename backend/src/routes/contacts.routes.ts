import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { contactsService, ContactImportItem } from '../services/contacts.service.js';

interface ContactParams {
  id: string;
}

interface CreateContactBody {
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

type UpdateContactBody = Partial<CreateContactBody>;

interface ContactQuery {
  search?: string;
  tagIds?: string | string[];
  meetingPlaceIds?: string | string[];
  gender?: 'male' | 'female';
  hasContact?: string;
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

export async function contactsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    await fastify.authenticate(request, reply);
  });

  // GET /api/contacts - Get all contacts
  fastify.get<{
    Querystring: ContactQuery;
  }>('/', async (request, reply) => {
    const {
      search,
      tagIds,
      meetingPlaceIds,
      gender,
      hasContact,
      metAtFrom,
      metAtTo,
      sortBy,
      sortOrder,
    } = request.query;

    const filters = {
      search,
      tagIds: tagIds ? (Array.isArray(tagIds) ? tagIds : [tagIds]) : undefined,
      meetingPlaceIds: meetingPlaceIds
        ? Array.isArray(meetingPlaceIds)
          ? meetingPlaceIds
          : [meetingPlaceIds]
        : undefined,
      gender,
      hasContact: hasContact === 'true',
      metAtFrom,
      metAtTo,
      sortBy,
      sortOrder,
    };

    const result = await contactsService.getAll(request.user.userId, filters);
    return reply.send(result);
  });

  // GET /api/contacts/:id - Get contact by ID
  fastify.get<{
    Params: ContactParams;
  }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const contact = await contactsService.getById(id, request.user.userId);
      return reply.send(contact);
    } catch {
      return reply.status(404).send({ error: 'Contact not found' });
    }
  });

  // POST /api/contacts - Create contact
  fastify.post<{
    Body: CreateContactBody;
  }>('/', async (request, reply) => {
    const { name, ...rest } = request.body;

    if (!name || name.trim().length === 0) {
      return reply.status(400).send({ error: 'Name is required' });
    }

    const contact = await contactsService.create(request.user.userId, {
      name,
      ...rest,
    });
    return reply.status(201).send(contact);
  });

  // PUT /api/contacts/:id - Update contact
  fastify.put<{
    Params: ContactParams;
    Body: UpdateContactBody;
  }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const contact = await contactsService.update(id, request.user.userId, request.body);
      return reply.send(contact);
    } catch {
      return reply.status(404).send({ error: 'Contact not found' });
    }
  });

  // DELETE /api/contacts/all - Delete all contacts
  fastify.delete('/all', async (request, reply) => {
    const result = await contactsService.deleteAll(request.user.userId);
    return reply.send(result);
  });

  // DELETE /api/contacts/:id - Delete contact
  fastify.delete<{
    Params: ContactParams;
  }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      await contactsService.delete(id, request.user.userId);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'Contact not found' });
    }
  });

  // POST /api/contacts/import - Import contacts from JSON
  fastify.post<{
    Body: { contacts: ContactImportItem[] };
  }>('/import', async (request, reply) => {
    const { contacts } = request.body;

    if (!contacts || !Array.isArray(contacts)) {
      return reply.status(400).send({ error: 'Contacts array is required' });
    }

    if (contacts.length === 0) {
      return reply.status(400).send({ error: 'Contacts array cannot be empty' });
    }

    if (contacts.length > 100) {
      return reply.status(400).send({ error: 'Cannot import more than 100 contacts at once' });
    }

    const result = await contactsService.importMany(request.user.userId, contacts);
    return reply.send(result);
  });

  // POST /api/contacts/:id/photo - Upload photo
  fastify.post<{
    Params: ContactParams;
    Body: { photoUrl: string };
  }>('/:id/photo', async (request, reply) => {
    const { id } = request.params;
    const { photoUrl } = request.body;

    if (!photoUrl) {
      return reply.status(400).send({ error: 'Photo URL is required' });
    }

    try {
      const contact = await contactsService.updatePhoto(id, request.user.userId, photoUrl);
      return reply.send(contact);
    } catch {
      return reply.status(404).send({ error: 'Contact not found' });
    }
  });

  // DELETE /api/contacts/:id/photo - Delete photo
  fastify.delete<{
    Params: ContactParams;
  }>('/:id/photo', async (request, reply) => {
    const { id } = request.params;

    try {
      const contact = await contactsService.deletePhoto(id, request.user.userId);
      return reply.send(contact);
    } catch {
      return reply.status(404).send({ error: 'Contact not found' });
    }
  });
}
