import { type FastifyReply, type FastifyRequest } from "fastify";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.unauthorized("Invalid or missing token");
  }
}
