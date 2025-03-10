import {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import {HttpCodes} from 'fastify/types/utils';
import {logger} from '../../../shared/utils/logger';

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCodes;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpCodes,
    description: string,
    isOperational: boolean,
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

class ErrorHandler {
  public async handler(
    error: FastifyError | AppError | Error,
    request: FastifyRequest,
    reply: FastifyReply,
    fastify: any,
  ) {
    // fastify.log.debug(`Request url: `, request.req.url);
    // fastify.log.debug(`Payload: `, request.body);
    logger.error(`Error occurred: `, error);
    // Check if the error is an instance of AppError
    if (error instanceof AppError) {
      await reply.status(error.httpCode).send({
        ok: false,
        message: error.message,
        name: error.name,
      });
      return;
    }

    // Check if the error is a Fastify error
    // if (error.validation) {
    //   return reply.status(400).send({
    //     ok: false,
    //     message: 'Validation error',
    //     errors: error.validation,
    //   });
    // }

    // Handle any uncaught errors
    await reply.status(500).send({
      ok: false,
      message: 'Internal Server Error',
    });

    return;
  }
}

export const errorHandler = new ErrorHandler();
