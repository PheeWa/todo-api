import type { Todo } from "../types/index.js";

const todos: Todo[] = [];

function checkOwnership(todo: Todo, userId: string): boolean {
  return todo.userId === userId;
}

export function getAllTodos(userId: string): Todo[] {
  return todos.filter((todo) => todo.userId === userId);
}

export function addTodo(title: string, userId: string): Todo {
  const id = crypto.randomUUID();
  const newTodo: Todo = {
    id,
    title,
    isCompleted: false,
    userId,
  };
  todos.push(newTodo);
  return newTodo;
}

export function getTodoById(id: string, userId: string): Todo | null {
  const foundTodo = todos.find((todo) => todo.id === id);
  if (!foundTodo) {
    return null;
  }

  if (!checkOwnership(foundTodo, userId)) {
    return null;
  }

  return foundTodo;
}

export function deleteTodoById(id: string, userId: string): boolean {
  const foundTodo = todos.find((todo) => todo.id === id);

  if (!foundTodo) {
    return false;
  }

  if (!checkOwnership(foundTodo, userId)) {
    return false;
  }

  const indexOfFoundTodo = todos.indexOf(foundTodo);
  todos.splice(indexOfFoundTodo, 1);
  return true;
}

export function updateTodo(
  id: string,
  userId: string,
  updates: { title?: string; isCompleted?: boolean }
): Todo | null {
  const foundTodo = todos.find((todo) => todo.id === id);
  if (!foundTodo) {
    return null;
  }

  if (!checkOwnership(foundTodo, userId)) {
    return null;
  }

  if (updates.title !== undefined) {
    foundTodo.title = updates.title;
  }
  if (updates.isCompleted !== undefined) {
    foundTodo.isCompleted = updates.isCompleted;
  }

  return foundTodo;
}
