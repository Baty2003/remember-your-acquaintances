import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { authService, JwtPayload } from '../services/auth.service.js';

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: JwtPayload;
  }
}

async function authPlugin(app: FastifyInstance) {
  // Decorate request with user property
  app.decorateRequest('user', null);

  // Add authenticate method to fastify instance
  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return reply.status(401).send({ error: 'No authorization header' });
      }

      const [scheme, token] = authHeader.split(' ');

      if (scheme !== 'Bearer' || !token) {
        return reply
          .status(401)
          .send({ error: 'Invalid authorization format. Use: Bearer <token>' });
      }

      const payload = authService.verifyToken(token);
      request.user = payload;
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  });
}

export default fp(authPlugin, {
  name: 'auth-plugin',
});
