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
    const todos = await getAllTodos(request.user.userId);
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
      const userId = request.user.userId;
      const newTodo = await addTodo(title, userId);

      return reply.code(201).send(newTodo);
    }
  );

  server.get<{ Params: { id: string } }>(
    "/todos/:id",
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user.userId;
      const todo = await getTodoById(id, userId);
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
      const userId = request.user.userId;

      const updatedTodo = await updateTodo(id, userId, updates);

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
      const userId = request.user.userId;
      const deleted = await deleteTodoById(id, userId);

      if (!deleted) {
        return reply.notFound("Todo not found");
      }

      return reply.code(204).send();
    }
  );
}
