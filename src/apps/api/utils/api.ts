import {FastifyReply, FastifyRequest} from 'fastify';

export const tryCatch: any =
  (controller: any) => async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await controller(req, res);
    } catch (error) {
      return res.send(error);
    }
  };
