import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserRole } from "../types/index.js";

export function requiredRole(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.unauthorized("Not authenticated");
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.forbidden("Insufficient permissions");
    }
  };
}
