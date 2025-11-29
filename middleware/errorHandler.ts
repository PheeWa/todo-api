import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export async function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 500;

  reply.code(statusCode).send({
    error: error.message || "Internal Server Error",
    statusCode: statusCode,
  });
}
