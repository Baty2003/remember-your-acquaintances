import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { config } from './config/env.js';
import authPlugin from './plugins/auth.plugin.js';
import { authRoutes } from './routes/auth.routes.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.isDev ? 'info' : 'warn',
      transport: config.isDev
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          }
        : undefined,
    },
  });

  // Register CORS
  await app.register(cors, {
    origin: true, // Allow all origins in development
  });

  // Register auth plugin (adds authenticate decorator)
  await app.register(authPlugin);

  // Health check route
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API info route
  app.get('/api', async () => {
    return {
      message: 'Welcome to Remember Your Acquaintances API',
      version: '1.0.0',
    };
  });

  // Register auth routes under /api/auth
  await app.register(authRoutes, { prefix: '/api/auth' });

  return app;
}
