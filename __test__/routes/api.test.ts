import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { fastify, type FastifyInstance } from "fastify";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import { authMiddleware } from "../../middleware/auth.js";
import { errorHandler } from "../../middleware/errorHandler.js";
import { authRoutes } from "../../routes/auth.js";
import { todoRoutes } from "../../routes/todo.js";
import { userRoutes } from "../../routes/user.js";

describe("API Integration Tests", () => {
  let server: FastifyInstance;
  let aliceToken: string;
  let bobToken: string;

  beforeEach(async () => {
    // create a Fastify instance
    server = fastify();

    // Register plugins
    await server.register(sensible);
    await server.register(jwt, {
      secret: "Thisisoursecretkeyfordemoanddevonly",
    });

    server.setErrorHandler(errorHandler);

    // Public routes (no auth)
    await server.register(async function (publicScope) {
      await publicScope.register(authRoutes);
    });
    // Protected routes (with auth)
    await server.register(async function (protectedScope) {
      protectedScope.addHook("preHandler", authMiddleware);
      await protectedScope.register(todoRoutes);
      await protectedScope.register(userRoutes);
    });

    // Get tokens to ready to use
    const aliceLogin = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "alice",
        password: "admin123",
      },
    });
    aliceToken = JSON.parse(aliceLogin.body).token;

    const userLogin = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "bob",
        password: "user123",
      },
    });
    bobToken = JSON.parse(userLogin.body).token;
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
          username: "alice",
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
          username: "alice",
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
          authorization: `Bearer ${aliceToken}`,
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

  describe("GET /me", () => {
    it("should return current user info with valid token", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/me",
        headers: {
          authorization: `Bearer ${aliceToken}`,
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.userId).toBe("550e8400-e29b-41d4-a716-446655440001");
      expect(body.username).toBe("alice");
    });

    it("should reject request without token", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/me",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  //   TODO: write test for:'POST /todos', 'GET /todos/:id', 'PATCH /todos/:id','DELETE /todos/:id' and 'POST /register' if time allows
});
