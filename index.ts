import fastify from "fastify";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/auth.js";
import { todoRoutes } from "./routes/todo.js";
import type { User } from "./types/index.js";
import { healthRoutes } from "./routes/health.js";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { username: string };
    user: User;
  }
}

const server = fastify({
  logger: true,
});

// Register plugins
await server.register(sensible);
await server.register(jwt, {
  // for dev and demo only
  secret: "Thisisoursecretkeyfordemoanddevonly",
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
});

server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
