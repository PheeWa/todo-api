import { describe, it, expect } from "@jest/globals";
import {
  getAllTodos,
  addTodo,
  getTodoById,
  deleteTodoById,
} from "../../services/todo.js";

// Use valid UUIDs for testing
const TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440001"; // alice
const TEST_USER2_ID = "550e8400-e29b-41d4-a716-446655440002"; // bob
const NONEXISTENT_UUID = "00000000-0000-0000-0000-000000000000";

describe("Todo Service", () => {
  describe("getAllTodos", () => {
    it("should return all todos for a user", async () => {
      await addTodo("First todo", TEST_USER_ID);
      await addTodo("Second todo", TEST_USER_ID);

      const allTodos = await getAllTodos(TEST_USER_ID);

      expect(allTodos.length).toBeGreaterThanOrEqual(2);
      expect(allTodos[0]?.userId).toBe(TEST_USER_ID);
      expect(allTodos[1]?.userId).toBe(TEST_USER_ID);
    });
  });

  describe("addTodo", () => {
    it("should create a new todo with correct properties", async () => {
      const newTodo = await addTodo("Buy milk", TEST_USER_ID);

      expect(newTodo).toBeDefined();
      expect(newTodo.id).toBeDefined();
      expect(newTodo.title).toBe("Buy milk");
      expect(newTodo.isCompleted).toBe(false);
      expect(newTodo.userId).toBe(TEST_USER_ID);
    });

    it("should add the todo to the list", async () => {
      const initialTodos = await getAllTodos(TEST_USER_ID);
      const initialCount = initialTodos.length;

      await addTodo("Another todo", TEST_USER_ID);

      const updatedTodos = await getAllTodos(TEST_USER_ID);
      expect(updatedTodos.length).toBe(initialCount + 1);
    });

    it("should generate unique IDs for different todos", async () => {
      const todo1 = await addTodo("Todo 1", TEST_USER_ID);
      const todo2 = await addTodo("Todo 2", TEST_USER_ID);

      expect(todo1.id).not.toBe(todo2.id);
    });

    it("should isolate todos by user", async () => {
      await addTodo("todo1", TEST_USER_ID);
      await addTodo("todo2", TEST_USER2_ID);

      const testusers1Todos = await getAllTodos(TEST_USER_ID);
      const testusers2Todos = await getAllTodos(TEST_USER2_ID);

      expect(testusers1Todos.length).toBeGreaterThanOrEqual(1);
      expect(testusers2Todos.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getTodoById", () => {
    it("should return a todo by id when user owns it", async () => {
      const newTodo = await addTodo("Find me", TEST_USER_ID);

      const foundTodo = await getTodoById(newTodo.id, TEST_USER_ID);

      expect(foundTodo).toBeDefined();
      expect(foundTodo?.id).toBe(newTodo.id);
      expect(foundTodo?.title).toBe("Find me");
      expect(foundTodo?.userId).toBe(TEST_USER_ID);
    });

    it("should return null when ID does not exist", async () => {
      const foundTodo = await getTodoById(NONEXISTENT_UUID, TEST_USER_ID);

      expect(foundTodo).toBeNull();
    });

    it("should return null when todo exists but user does not own it", async () => {
      const todo = await addTodo("user1'd todo", TEST_USER_ID);

      const foundTod = await getTodoById(todo.id, TEST_USER2_ID);
      expect(foundTod).toBeNull();
    });

    it("should only return todo to the owner", async () => {
      const user1Todo = await addTodo("User1 todo", TEST_USER_ID);
      const user2Todo = await addTodo("User2 todo", TEST_USER2_ID);

      expect(await getTodoById(user1Todo.id, TEST_USER_ID)).not.toBeNull();
      expect(await getTodoById(user2Todo.id, TEST_USER_ID)).toBeNull();

      expect(await getTodoById(user2Todo.id, TEST_USER2_ID)).not.toBeNull();
      expect(await getTodoById(user1Todo.id, TEST_USER2_ID)).toBeNull();
    });
  });

  describe("deleteTodoById", () => {
    it("should delete a todo when user owns it", async () => {
      const todo = await addTodo("Buy milk", TEST_USER_ID);
      const initialTodos = await getAllTodos(TEST_USER_ID);
      const initialCount = initialTodos.length;

      const result = await deleteTodoById(todo.id, TEST_USER_ID);

      expect(result).toBe(true);
      const updatedTodos = await getAllTodos(TEST_USER_ID);
      expect(updatedTodos.length).toBe(initialCount - 1);
    });

    it("should return false when todo does not exist", async () => {
      const result = await deleteTodoById(NONEXISTENT_UUID, TEST_USER_ID);
      expect(result).toBe(false);
    });

    it("should only allow owner to delete their todo", async () => {
      const user1Todo = await addTodo("User1 todo", TEST_USER_ID);
      const user2Todo = await addTodo("User2 todo", TEST_USER2_ID);

      expect(await deleteTodoById(user2Todo.id, TEST_USER_ID)).toBe(false);
      expect(await deleteTodoById(user1Todo.id, TEST_USER2_ID)).toBe(false);

      expect(await deleteTodoById(user1Todo.id, TEST_USER_ID)).toBe(true);
      expect(await deleteTodoById(user2Todo.id, TEST_USER2_ID)).toBe(true);
    });
  });
});
