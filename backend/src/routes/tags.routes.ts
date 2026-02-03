import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { tagsService } from '../services/tags.service.js';
import { translateError, getLocaleFromHeader, type Locale } from '../lib/errors.js';

function getLocale(request: FastifyRequest): Locale {
  return getLocaleFromHeader(request.headers['accept-language']);
}

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

    const locale = getLocale(request);
    if (!name || name.trim().length === 0) {
      return reply.status(400).send({ error: translateError('Name is required', locale) });
    }

    try {
      const tag = await tagsService.create(request.user.userId, { name: name.trim() });
      return reply.status(201).send(tag);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create tag';
      const translated = translateError(message, locale);
      if (message === 'Tag already exists') {
        return reply.status(409).send({ error: translated });
      }
      return reply.status(500).send({ error: translated });
    }
  });

  // PUT /api/tags/:id - Update tag
  fastify.put<{ Params: TagParams; Body: CreateTagBody }>('/:id', async (request, reply) => {
    const { id } = request.params;
    const { name } = request.body;

    const locale = getLocale(request);
    if (!name || name.trim().length === 0) {
      return reply.status(400).send({ error: translateError('Name is required', locale) });
    }

    try {
      const tag = await tagsService.update(id, request.user.userId, { name: name.trim() });
      return reply.send(tag);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update tag';
      const translated = translateError(message, locale);
      if (message === 'Tag not found') {
        return reply.status(404).send({ error: translated });
      }
      if (message === 'Tag already exists') {
        return reply.status(409).send({ error: translated });
      }
      return reply.status(500).send({ error: translated });
    }
  });

  // DELETE /api/tags/:id - Delete tag
  fastify.delete<{ Params: TagParams }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      await tagsService.delete(id, request.user.userId);
      return reply.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete tag';
      const locale = getLocale(request);
      const translated = translateError(message, locale);
      if (message === 'Tag not found') {
        return reply.status(404).send({ error: translated });
      }
      if (message.startsWith('Cannot delete tag')) {
        return reply.status(409).send({ error: translated });
      }
      return reply.status(500).send({ error: translated });
    }
  });
}
