import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import {AppError} from '../utils/errors';
import {logger} from '../../../shared/utils/logger';

const userRoutesHandler = (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: () => void,
) => {
  fastify.get('/users', (req, res) => {
    logger.info('TEST USERS');

    // if (req) {
    //   throw new AppError('test', 400, 'Bad Request', true);
    // }

    return 'hell yeah!';
  });
  done();
};

export {userRoutesHandler};
