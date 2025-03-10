import '../../shared/import-side-effects';
import {fastify as Fastify} from 'fastify';
import {logger} from '../../shared/utils/logger';
import {AppError, errorHandler} from './utils/errors';
import {tryCatch} from './utils/api';
import {userRoutesHandler} from './routes/userRoutes';
// OTEL THINGS (if prod or deploy env do this?)
// import './utils/otel';
// import {trace} from '@opentelemetry/api';
// const tracer = trace.getTracer('example-otlp-exporter-node');

const fastify = Fastify({loggerInstance: logger as any});

fastify.setErrorHandler(async (err, req, res) => {
  await errorHandler.handler(err, req, res, fastify);
});

// fastify.get(
//   '/ping',
//   tryCatch(async (req: any, res: any) => {
//     console.log('data: ', data);
//     const user = getUser();

//     if (!user) {
//       throw new AppError('user.notFound', 400, 'User not found', true);
//     }
//     res.send('pong\n');
//   }),
// );

const registerRoutes = async () => {
  try {
    await fastify.register(userRoutesHandler);
  } catch (err) {
    logger.error('Error registerRoutes', err);
  }
};

const startServer = async () => {
  await registerRoutes();
  try {
    fastify.listen({port: 8000, host: '0.0.0.0'}, (err, address) => {
      if (err) {
        logger.error('Server start up error', err);
        throw new Error('Server start up error');
      }
      logger.info(`Server listening at ${address}`);
    });
  } catch (error) {
    logger.error('Failed to initialize services', error);
    throw new Error('Failed to initialize services');
  }
};

startServer().catch(error => {
  logger.error('Failed to start server', error);
});
