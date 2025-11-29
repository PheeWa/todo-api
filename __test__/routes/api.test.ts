import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { fastify, type FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth.js";
import { errorHandler } from "../../middleware/errorHandler.js";
import { authRoutes } from "../../routes/auth.js";
import { todoRoutes } from "../../routes/todo.js";

describe("API Integration Tests", () => {
  let app: FastifyInstance;
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    // create a Fastify instance
    app = fastify();

    // Register middleware
    app.addHook("preHandler", authMiddleware);
    app.setErrorHandler(errorHandler);

    // Register routes
    await app.register(authRoutes);
    await app.register(todoRoutes);

    // Get tokens to ready to use
    const adminLogin = await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "admin",
        password: "admin123",
      },
    });
    adminToken = JSON.parse(adminLogin.body).token;

    const userLogin = await app.inject({
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
    await app.close();
  });

  describe("POST /login", () => {
    it("should login with valid credentials", async () => {
      const res = await app.inject({
        method: "POST",
        url: "/login",
        payload: {
          username: "admin",
          password: "admin123",
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.token).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
      const res = await app.inject({
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
      const res = await app.inject({
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
      const res = await app.inject({
        method: "GET",
        url: "/todos",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  //   TODO: write test for:'POST /todos', 'GET /todos/:id', 'PATCH /todos/:id','DELETE /todos/:id' if time allows
});
