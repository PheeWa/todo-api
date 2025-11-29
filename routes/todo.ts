import type { FastifyInstance, FastifyRequest } from "fastify";
import {
  addTodo,
  deleteTodoById,
  getAllTodos,
  getTodoById,
  updateTodo,
} from "../services/todo.js";
import {
  CreateTodoSchema,
  type CreateTodoBody,
  UpdateTodoSchema,
  type UpdateTodoBody,
} from "../schemas/todo.js";
import { requiredRole } from "../middleware/authorize.js";

export async function todoRoutes(server: FastifyInstance) {
  server.get("/todos", async (_request, reply) => {
    const todos = getAllTodos();
    return reply.send(todos);
  });

  server.post(
    "/todos",
    {
      schema: {
        body: CreateTodoSchema,
      },
      preHandler: requiredRole("admin", "user"),
    },
    async (request: FastifyRequest<{ Body: CreateTodoBody }>, reply) => {
      const { title } = request.body;
      const newTodo = addTodo(title);

      return reply.code(201).send(newTodo);
    }
  );

  server.get<{ Params: { id: string } }>(
    "/todos/:id",
    async (request, reply) => {
      const { id } = request.params;
      const todo = getTodoById(id);
      if (!todo) {
        // return reply.code(404).send({ error: "Todo not found" });
        return reply.notFound("Todo not found");
      }

      return reply.send(todo);
    }
  );

  server.patch<{ Params: { id: string }; Body: UpdateTodoBody }>(
    "/todos/:id",
    {
      schema: {
        body: UpdateTodoSchema,
      },
      preHandler: requiredRole("admin", "user"),
    },
    async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;

      const updatedTodo = updateTodo(id, updates);

      if (!updatedTodo) {
        return reply.code(404).send({ error: "Todo not found" });
      }

      return reply.send(updatedTodo);
    }
  );

  server.delete<{ Params: { id: string } }>(
    "/todos/:id",
    {
      preHandler: requiredRole("admin"),
    },
    async (request, reply) => {
      const { id } = request.params;
      const deleted = deleteTodoById(id);

      if (!deleted) {
        reply.code(404).send({ error: "Todo not found" });
      }

      return reply.code(204).send();
    }
  );
}
