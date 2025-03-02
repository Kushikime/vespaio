import './utils/otel';
import {fastify as Fastify} from 'fastify';
import {logger} from '../../shared/utils/logger';
import {AppError, errorHandler} from './utils/errors';
import {tryCatch} from './utils/api';

const fastify = Fastify({loggerInstance: logger as any});

fastify.setErrorHandler(async (err, req, res) => {
  await errorHandler.handler(err, req, res, fastify);
});

function getUser() {
  return {id: 1, name: 'Erik'};
}

fastify.get(
  '/ping',
  tryCatch(async () => {
    const user = getUser();

    if (!user) {
      throw new AppError('user.notFound', 400, 'User not found', true);
    }
    return 'pong\n';
  }),
);

fastify.listen({port: 8000}, (err, address) => {
  if (err) {
    throw Error('Server start up error', err);
  }

  console.log(`Server listening at ${address}`);
});

// Add ErrorHandler with ApiError (For business errors)
// Add OpenTelemetry with AutoInstumentation
// Setup a local running collector with Grafana + Tempo
// Setup test traces(spans) and metrics.
