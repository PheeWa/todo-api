import { describe, it, expect } from "@jest/globals";
import {
  getAllTodos,
  addTodo,
  getTodoById,
  deleteTodoById,
} from "../../services/todo.js";

describe("Todo Service", () => {
  describe("getAllTodos", () => {
    it("should return all todos for a user", () => {
      addTodo("First todo", "testuser");
      addTodo("Second todo", "testuser");

      const allTodos = getAllTodos("testuser");

      expect(allTodos.length).toBeGreaterThanOrEqual(2);
      expect(allTodos[0]?.userId).toBe("testuser");
      expect(allTodos[0]?.userId).toBe("testuser");
    });
  });

  describe("addTodo", () => {
    it("should create a new todo with correct properties", () => {
      const newTodo = addTodo("Buy milk", "testuser");

      expect(newTodo).toBeDefined();
      expect(newTodo.id).toBeDefined();
      expect(newTodo.title).toBe("Buy milk");
      expect(newTodo.isCompleted).toBe(false);
      expect(newTodo.userId).toBe("testuser");
    });

    it("should add the todo to the list", () => {
      const initialCount = getAllTodos("testuser").length;
      const title = "Another todo";

      addTodo("Another todo", "testuser");

      expect(getAllTodos("testuser").length).toBe(initialCount + 1);
    });

    it("should generate unique IDs for different todos", () => {
      const todo1 = addTodo("Todo 1", "testuser");
      const todo2 = addTodo("Todo 2", "testuser");

      expect(todo1.id).not.toBe(todo2.id);
    });

    it("should isolate todos by user", () => {
      addTodo("todo1", "testuser1");
      addTodo("todo2", "testuser2");

      const testusers1Todos = getAllTodos("testuser1");
      const testusers2Todos = getAllTodos("testuser2");

      expect(testusers1Todos).toHaveLength(1);
      expect(testusers1Todos[0]!.title).toBe("todo1");

      expect(testusers2Todos).toHaveLength(1);
      expect(testusers2Todos[0]!.title).toBe("todo2");
    });
  });

  describe("getTodoById", () => {
    it("should return a todo by id when user owns it", () => {
      const newTodo = addTodo("Find me", "testuser");

      const foundTodo = getTodoById(newTodo.id, "testuser");

      expect(foundTodo).toBeDefined();
      expect(foundTodo?.id).toBe(newTodo.id);
      expect(foundTodo?.title).toBe("Find me");
      expect(foundTodo?.userId).toBe("testuser");
    });

    it("should return null when ID does not exist", () => {
      const nonExistentId = "thisIdisnotexist";

      const foundTodo = getTodoById(nonExistentId, "testuser");

      expect(foundTodo).toBeNull();
    });

    it("should return null when todo exists but user does not own it", () => {
      const todo = addTodo("user1'd todo", "user1");

      const foundTod = getTodoById(todo.id, "user2");
      expect(foundTod).toBeNull();
    });

    it("should only return todo to the owner", () => {
      const user1Todo = addTodo("User1 todo", "user1");
      const user2Todo = addTodo("User2 todo", "user2");

      expect(getTodoById(user1Todo.id, "user1")).not.toBeNull();
      expect(getTodoById(user2Todo.id, "user1")).toBeNull();

      expect(getTodoById(user2Todo.id, "user2")).not.toBeNull();
      expect(getTodoById(user1Todo.id, "user2")).toBeNull();
    });
  });

  describe("deleteTodoById", () => {
    it("should delete a todo when user owns it", () => {
      const todo = addTodo("Buy milk", "testuser");
      const initialCount = getAllTodos("testuser").length;

      const result = deleteTodoById(todo.id, "testuser");

      expect(result).toBe(true);
      expect(getAllTodos("testuser").length).toBe(initialCount - 1);
    });

    it("should return false when todo does not exist", () => {
      const result = deleteTodoById("thisIdisnotexist", "testuser");
      expect(result).toBe(false);
    });

    it("should only allow owner to delete their todo", () => {
      const user1Todo = addTodo("User1 todo", "user1");
      const user2Todo = addTodo("User2 todo", "user2");

      expect(deleteTodoById(user2Todo.id, "user1")).toBe(false);
      expect(deleteTodoById(user1Todo.id, "user2")).toBe(false);

      expect(deleteTodoById(user1Todo.id, "user1")).toBe(true);
      expect(deleteTodoById(user2Todo.id, "user2")).toBe(true);
    });
  });
});
