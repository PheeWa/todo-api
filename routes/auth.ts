import { type FastifyInstance } from "fastify";
import { authenticateUser, registerUser } from "../services/auth.js";
import {
  LoginSchema,
  RegisterSchema,
  type LoginBody,
  type RegisterBody,
} from "../schemas/auth.js";

export async function authRoutes(server: FastifyInstance) {
  server.post<{ Body: LoginBody }>(
    "/login",
    {
      schema: { body: LoginSchema },
    },
    async (request, reply) => {
      const { username, password } = request.body;
      const user = await authenticateUser(username, password);

      if (!user) {
        return reply.unauthorized("Invalid credentials");
      }

      const token = server.jwt.sign({
        userId: user.userId,
        username: user.username,
      });
      return reply.send({ token, username });
    }
  );

  server.post<{ Body: RegisterBody }>(
    "/register",
    {
      schema: { body: RegisterSchema },
    },
    async (request, reply) => {
      const { username, password } = request.body;
      const newUser = await registerUser(username, password);

      if (!newUser) {
        return reply.conflict("Username already exists");
      }

      // auto login after register
      const token = server.jwt.sign({
        userId: newUser.userId,
        username: newUser.username,
      });

      return reply.code(201).send({ token, username });
    }
  );
}
