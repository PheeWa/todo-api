interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

const todos: Todo[] = [];
export function getAllTodos() {
  return todos;
}

export function addTodo(title: string): Todo {
  const id = crypto.randomUUID();
  const newTodo: Todo = {
    id,
    title,
    isCompleted: false,
  };
  todos.push(newTodo);
  return newTodo;
}

export function getTodoById(id: string): Todo | null {
  return todos.find((todo) => todo.id === id) ?? null;
}

export function deleteTodoById(id: string): boolean {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return false;
  }
  todos.splice(index, 1);
  return true;
}

export function updateTodo(
  id: string,
  updates: { title?: string; isCompleted?: boolean }
): Todo | null {
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return null;
  }

  if (updates.title !== undefined) {
    todo.title = updates.title;
  }
  if (updates.isCompleted !== undefined) {
    todo.isCompleted = updates.isCompleted;
  }

  return todo;
}
