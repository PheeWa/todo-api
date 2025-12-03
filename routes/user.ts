import type { FastifyInstance } from "fastify";

export async function userRoutes(server: FastifyInstance) {
  server.get("/me", async (request, reply) => {
    return reply.send({
      userId: request.user.userId,
      username: request.user.username,
    });
  });
}
