import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { statsService } from '../services/stats.service.js';

export async function statsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    await fastify.authenticate(request, reply);
  });

  // GET /api/stats - Get user statistics
  fastify.get('/', async (request, reply) => {
    const stats = await statsService.getUserStats(request.user.userId);
    return reply.send(stats);
  });
}
