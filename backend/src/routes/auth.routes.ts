import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service.js';

interface AuthBody {
  username: string;
  password: string;
}

const authBodySchema = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 50 },
    password: { type: 'string', minLength: 6, maxLength: 100 },
  },
};

export async function authRoutes(app: FastifyInstance) {
  // Register new user
  app.post<{ Body: AuthBody }>(
    '/register',
    {
      schema: {
        body: authBodySchema,
      },
    },
    async (request: FastifyRequest<{ Body: AuthBody }>, reply: FastifyReply) => {
      try {
        const { username, password } = request.body;
        const result = await authService.register(username, password);

        return reply.status(201).send({
          message: 'User registered successfully',
          user: result.user,
          token: result.token,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';

        if (message === 'Username already taken') {
          return reply.status(409).send({ error: message });
        }

        return reply.status(500).send({ error: message });
      }
    }
  );

  // Login user
  app.post<{ Body: AuthBody }>(
    '/login',
    {
      schema: {
        body: authBodySchema,
      },
    },
    async (request: FastifyRequest<{ Body: AuthBody }>, reply: FastifyReply) => {
      try {
        const { username, password } = request.body;
        const result = await authService.login(username, password);

        return reply.send({
          message: 'Login successful',
          user: result.user,
          token: result.token,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        return reply.status(401).send({ error: message });
      }
    }
  );

  // Get current user (protected route example)
  app.get(
    '/me',
    {
      preHandler: [app.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await authService.getUserById(request.user.userId);

        if (!user) {
          return reply.status(404).send({ error: 'User not found' });
        }

        return reply.send({ user });
      } catch {
        return reply.status(500).send({ error: 'Failed to get user' });
      }
    }
  );
}
