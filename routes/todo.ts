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

export async function todoRoutes(server: FastifyInstance) {
  server.get("/todos", async (request, reply) => {
    const todos = getAllTodos(request.user.username);
    return reply.send(todos);
  });

  server.post(
    "/todos",
    {
      schema: {
        body: CreateTodoSchema,
      },
    },
    async (request: FastifyRequest<{ Body: CreateTodoBody }>, reply) => {
      const { title } = request.body;
      const userId = request.user.username;
      const newTodo = addTodo(title, userId);

      return reply.code(201).send(newTodo);
    }
  );

  server.get<{ Params: { id: string } }>(
    "/todos/:id",
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user.username;
      const todo = getTodoById(id, userId);
      if (!todo) {
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
    },
    async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;
      const userId = request.user.username;

      const updatedTodo = updateTodo(id, userId, updates);

      if (!updatedTodo) {
        return reply.notFound("Todo not found");
      }

      return reply.send(updatedTodo);
    }
  );

  server.delete<{ Params: { id: string } }>(
    "/todos/:id",
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user.username;
      const deleted = deleteTodoById(id, userId);

      if (!deleted) {
        return reply.notFound("Todo not found");
      }

      return reply.code(204).send();
    }
  );
}
