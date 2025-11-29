import fastify from "fastify";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/auth.js";
import { todoRoutes } from "./routes/todo.js";
import type { UserData } from "./types/index.js";
import { healthRoutes } from "./routes/health.js";
import sensible from "@fastify/sensible";

declare module "fastify" {
  interface FastifyRequest {
    user?: UserData;
  }
}

const server = fastify({
  logger: true,
});

// Register plugin
await server.register(sensible);

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
