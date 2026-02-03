import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { authService, JwtPayload } from '../services/auth.service.js';
import { translateError, getLocaleFromHeader, type Locale } from '../lib/errors.js';

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
  // Decorate request with user property (use undefined cast to satisfy TypeScript)
  app.decorateRequest('user', undefined as unknown as JwtPayload);

  // Add authenticate method to fastify instance
  app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    const locale: Locale = getLocaleFromHeader(request.headers['accept-language']);

    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return reply.status(401).send({ error: translateError('No authorization header', locale) });
      }

      const [scheme, token] = authHeader.split(' ');

      if (scheme !== 'Bearer' || !token) {
        return reply.status(401).send({
          error: translateError('Invalid authorization format. Use: Bearer <token>', locale),
        });
      }

      const payload = authService.verifyToken(token);
      request.user = payload;
    } catch {
      return reply.status(401).send({ error: translateError('Invalid or expired token', locale) });
    }
  });
}

export default fp(authPlugin, {
  name: 'auth-plugin',
});
