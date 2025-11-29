import { describe, it, expect } from "@jest/globals";
import {
  getAllTodos,
  addTodo,
  getTodoById,
  deleteTodoById,
} from "../../services/todo.js";

describe("Todo Service", () => {
  describe("getAllTodos", () => {
    it("should return all todos", () => {
      const todo1 = addTodo("First todo");
      const todo2 = addTodo("Second todo");

      const allTodos = getAllTodos();

      expect(allTodos.length).toBeGreaterThanOrEqual(2);
      expect(allTodos).toContain(todo1);
      expect(allTodos).toContain(todo2);
    });
  });

  describe("addTodo", () => {
    it("should create a new todo with correct properties", () => {
      const title = "Test todo";

      const newTodo = addTodo(title);

      expect(newTodo).toBeDefined();
      expect(newTodo.id).toBeDefined();
      expect(newTodo.title).toBe(title);
      expect(newTodo.isCompleted).toBe(false);
    });

    it("should add the todo to the list", () => {
      const initialCount = getAllTodos().length;
      const title = "Another todo";

      addTodo(title);

      expect(getAllTodos().length).toBe(initialCount + 1);
    });

    it("should generate unique IDs for different todos", () => {
      const todo1 = addTodo("Todo 1");
      const todo2 = addTodo("Todo 2");

      expect(todo1.id).not.toBe(todo2.id);
    });
  });

  describe("getTodoById", () => {
    it("should return the todo when ID exists", () => {
      const newTodo = addTodo("Find me");

      const foundTodo = getTodoById(newTodo.id);

      expect(foundTodo).toBeDefined();
      expect(foundTodo?.id).toBe(newTodo.id);
      expect(foundTodo?.title).toBe("Find me");
    });

    it("should return null when ID does not exist", () => {
      const nonExistentId = "thisIdisnotexist";

      const foundTodo = getTodoById(nonExistentId);

      expect(foundTodo).toBeNull();
    });
  });

  describe("deleteTodoById", () => {
    it("should delete the todo and return true when ID exists", () => {
      const newTodo = addTodo("Todo to delete");
      const initialCount = getAllTodos().length;

      const result = deleteTodoById(newTodo.id);

      expect(result).toBe(true);
      expect(getAllTodos().length).toBe(initialCount - 1);
      expect(getTodoById(newTodo.id)).toBeNull();
    });

    it("should return false when ID does not exist", () => {
      const nonExistentId = "thisIdisnotexist";
      const initialCount = getAllTodos().length;

      const result = deleteTodoById(nonExistentId);

      expect(result).toBe(false);
      expect(getAllTodos().length).toBe(initialCount);
    });

    it("should only delete the specified todo", () => {
      const todo1 = addTodo("Todo to keep");
      const todo2 = addTodo("Todo to delete");
      const todo3 = addTodo("Keep this too");

      deleteTodoById(todo2.id);

      expect(getTodoById(todo1.id)).toBeDefined();
      expect(getTodoById(todo2.id)).toBeNull();
      expect(getTodoById(todo3.id)).toBeDefined();
    });
  });
});
