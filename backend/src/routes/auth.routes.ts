import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service.js';
import { translateError, getLocaleFromHeader, type Locale } from '../lib/errors.js';

interface AuthBody {
  username: string;
  password: string;
}

interface LocaleBody {
  locale: 'en' | 'ru';
}

const authBodySchema = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 50 },
    password: { type: 'string', minLength: 6, maxLength: 100 },
  },
};

const localeBodySchema = {
  type: 'object',
  required: ['locale'],
  properties: {
    locale: { type: 'string', enum: ['en', 'ru'] },
  },
};

function getLocale(request: FastifyRequest): Locale {
  const acceptLanguage = request.headers['accept-language'];
  return getLocaleFromHeader(acceptLanguage);
}

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
        const locale = getLocale(request);
        const translated = translateError(message, locale);

        if (message === 'Username already taken') {
          return reply.status(409).send({ error: translated });
        }

        return reply.status(500).send({ error: translated });
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
        const locale = getLocale(request);
        const translated = translateError(message, locale);
        return reply.status(401).send({ error: translated });
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
          const locale = getLocale(request);
          return reply.status(404).send({ error: translateError('User not found', locale) });
        }

        return reply.send({
          user: {
            id: user.id,
            username: user.username,
            locale: user.locale ?? 'en',
            createdAt: user.createdAt,
          },
        });
      } catch {
        const locale = getLocale(request);
        return reply.status(500).send({ error: translateError('Failed to get user', locale) });
      }
    }
  );

  // Update user locale (protected)
  app.put<{ Body: LocaleBody }>(
    '/locale',
    {
      preHandler: [app.authenticate],
      schema: {
        body: localeBodySchema,
      },
    },
    async (request: FastifyRequest<{ Body: LocaleBody }>, reply: FastifyReply) => {
      try {
        const { locale } = request.body;
        const result = await authService.updateLocale(request.user.userId, locale);
        return reply.send(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update locale';
        const locale = getLocale(request);
        const translated = translateError(message, locale);
        if (message === 'Invalid locale. Use "en" or "ru"') {
          return reply.status(400).send({ error: translated });
        }
        return reply.status(500).send({ error: translated });
      }
    }
  );
}
