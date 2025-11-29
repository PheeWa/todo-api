import { type FastifyReply, type FastifyRequest } from "fastify";
import { validateToken } from "../services/auth.js";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Get the authentication header
  const authHeader = request.headers.authorization;

  // Check if header exists and has correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.unauthorized("No token provided");
  }

  // get the Bearer out of token so we can use it to validate the token
  const token = authHeader.replace("Bearer ", "");
  const userData = validateToken(token);

  if (!userData) {
    return reply.unauthorized("Invalid token");
  }

  request.user = userData;
}
