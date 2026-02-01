import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { tagsService } from '../services/tags.service.js';

interface TagParams {
  id: string;
}

interface CreateTagBody {
  name: string;
}

export async function tagsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    await fastify.authenticate(request, reply);
  });

  // GET /api/tags - Get all tags
  fastify.get('/', async (request, reply) => {
    const result = await tagsService.getAll(request.user.userId);
    return reply.send(result);
  });

  // POST /api/tags - Create tag
  fastify.post<{ Body: CreateTagBody }>('/', async (request, reply) => {
    const { name } = request.body;

    if (!name || name.trim().length === 0) {
      return reply.status(400).send({ error: 'Name is required' });
    }

    try {
      const tag = await tagsService.create(request.user.userId, { name: name.trim() });
      return reply.status(201).send(tag);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create tag';
      if (message === 'Tag already exists') {
        return reply.status(409).send({ error: message });
      }
      return reply.status(500).send({ error: message });
    }
  });

  // DELETE /api/tags/:id - Delete tag
  fastify.delete<{ Params: TagParams }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      await tagsService.delete(id, request.user.userId);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'Tag not found' });
    }
  });
}
