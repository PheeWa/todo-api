import { type FastifyInstance } from "fastify";
import { createToken, findUser } from "../services/auth.js";

export async function authRoutes(server: FastifyInstance) {
  server.post<{ Body: { username: string; password: string } }>(
    "/login",
    async (request, reply) => {
      const { username, password } = request.body;
      const user = await findUser(username, password);

      if (!user) {
        return reply.unauthorized("Invalid credentials");
      }

      const token = createToken(username, user.role);
      return reply.send({ token });
    }
  );
}
