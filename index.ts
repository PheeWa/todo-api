import "dotenv/config";
import fastify from "fastify";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/auth.js";
import { todoRoutes } from "./routes/todo.js";
import type { User } from "./types/index.js";
import { healthRoutes } from "./routes/health.js";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import { config } from "./config/env.js";
import { userRoutes } from "./routes/user.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: User;
    user: User;
  }
}

const server = fastify({
  // For development: logs all requests. For production, configure proper logging with redaction of sensitive data (e.g., tokens, passwords)
  logger: true,
});

// Register plugins
await server.register(sensible);
await server.register(jwt, {
  secret: config.jwtSecret,
  sign: {
    expiresIn: "7d",
  },
});

// Global error handler
server.setErrorHandler(errorHandler);

// Plublic routes (no auth)
server.register(async function (publicScope) {
  publicScope.register(healthRoutes);
  publicScope.register(authRoutes);
});

// Protected routes(with auth)
server.register(async function (protectedScope) {
  // middleware
  protectedScope.addHook("preHandler", authMiddleware);
  protectedScope.register(todoRoutes);
  protectedScope.register(userRoutes);
});

server.listen({ port: config.port, host: config.host }, (err, address) => {
  if (err) {
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
