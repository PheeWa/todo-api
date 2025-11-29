import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { fastify, type FastifyInstance } from "fastify";
import sensible from "@fastify/sensible";
import { authMiddleware } from "../../middleware/auth.js";
import { errorHandler } from "../../middleware/errorHandler.js";
import { authRoutes } from "../../routes/auth.js";
import { todoRoutes } from "../../routes/todo.js";

describe("API Integration Tests", () => {
  let server: FastifyInstance;
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    // create a Fastify instance
    server = fastify();

    // Register sensible plugin
    await server.register(sensible);

    server.setErrorHandler(errorHandler);

    // Public routes (no auth)
    await server.register(async function (publicScope) {
      await publicScope.register(authRoutes);
    });
    // Protected routes (with auth)
    await server.register(async function (protectedScope) {
      protectedScope.addHook("preHandler", authMiddleware);
      await protectedScope.register(todoRoutes);
    });

    // Get tokens to ready to use
    const adminLogin = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "admin",
        password: "admin123",
      },
    });
    adminToken = JSON.parse(adminLogin.body).token;

    const userLogin = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "user",
        password: "user123",
      },
    });
    userToken = JSON.parse(userLogin.body).token;
  });

  afterEach(async () => {
    await server.close();
  });

  describe("POST /login", () => {
    it("should login with valid credentials", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/login",
        payload: {
          username: "admin",
          password: "admin123",
        },
      });

      // Add this to see the error:
      if (res.statusCode === 500) {
        console.log("ERROR:", res.body);
      }

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.token).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/login",
        payload: {
          username: "admin",
          password: "wrongpassword",
        },
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /todos", () => {
    it("should return todos with valid token", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/todos",
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body)).toBe(true);
    });

    it("should reject request without token", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/todos",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  //   TODO: write test for:'POST /todos', 'GET /todos/:id', 'PATCH /todos/:id','DELETE /todos/:id' if time allows
});
