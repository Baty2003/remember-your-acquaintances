import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { meetingPlacesService } from '../services/meetingPlaces.service.js';

interface MeetingPlaceParams {
  id: string;
}

interface CreateMeetingPlaceBody {
  name: string;
}

export async function meetingPlacesRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    await fastify.authenticate(request, reply);
  });

  // GET /api/meeting-places - Get all meeting places
  fastify.get('/', async (request, reply) => {
    const result = await meetingPlacesService.getAll(request.user.userId);
    return reply.send(result);
  });

  // POST /api/meeting-places - Create meeting place
  fastify.post<{ Body: CreateMeetingPlaceBody }>('/', async (request, reply) => {
    const { name } = request.body;

    if (!name || name.trim().length === 0) {
      return reply.status(400).send({ error: 'Name is required' });
    }

    try {
      const meetingPlace = await meetingPlacesService.create(request.user.userId, {
        name: name.trim(),
      });
      return reply.status(201).send(meetingPlace);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create meeting place';
      if (message === 'Meeting place already exists') {
        return reply.status(409).send({ error: message });
      }
      return reply.status(500).send({ error: message });
    }
  });

  // PUT /api/meeting-places/:id - Update meeting place
  fastify.put<{ Params: MeetingPlaceParams; Body: CreateMeetingPlaceBody }>(
    '/:id',
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;

      if (!name || name.trim().length === 0) {
        return reply.status(400).send({ error: 'Name is required' });
      }

      try {
        const meetingPlace = await meetingPlacesService.update(id, request.user.userId, {
          name: name.trim(),
        });
        return reply.send(meetingPlace);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update meeting place';
        if (message === 'Meeting place not found') {
          return reply.status(404).send({ error: message });
        }
        if (message === 'Meeting place already exists') {
          return reply.status(409).send({ error: message });
        }
        return reply.status(500).send({ error: message });
      }
    }
  );

  // DELETE /api/meeting-places/:id - Delete meeting place
  fastify.delete<{ Params: MeetingPlaceParams }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      await meetingPlacesService.delete(id, request.user.userId);
      return reply.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete meeting place';
      if (message === 'Meeting place not found') {
        return reply.status(404).send({ error: message });
      }
      if (message.startsWith('Cannot delete meeting place')) {
        return reply.status(409).send({ error: message });
      }
      return reply.status(500).send({ error: message });
    }
  });
}
