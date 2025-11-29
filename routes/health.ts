import type { FastifyInstance } from "fastify";

export async function healthRoutes(server: FastifyInstance) {
  server.get("/health", async (_request, reply) => {
    return reply.send({ status: "ok" });
  });
}
