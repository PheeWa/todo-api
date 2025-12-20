import type { Todo } from "../types/index.js";
import { pool } from "../config/database.js";

export async function getAllTodos(userId: string): Promise<Todo[]> {
  try {
    const query = `SELECT id, title, is_completed, user_id
  FROM todos
  WHERE user_id = $1
  ORDER BY created_at DESC`;
    const result = await pool.query(query, [userId]);

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      isCompleted: row.is_completed,
      userId: row.user_id,
    }));
  } catch (error) {
    console.error("Error getting todos:", error);
    throw error;
  }
}

export async function addTodo(title: string, userId: string): Promise<Todo> {
  try {
    const query = `INSERT INTO todos (title, user_id) 
   VALUES ($1, $2)
   RETURNING id, title, is_completed, user_id`;
    const result = await pool.query(query, [title, userId]);

    const newTodo = result.rows[0];
    return {
      id: newTodo.id,
      title: newTodo.title,
      isCompleted: newTodo.is_completed,
      userId: newTodo.user_id,
    };
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
}

export async function getTodoById(
  id: string,
  userId: string
): Promise<Todo | null> {
  try {
    const query = `SELECT id, title, is_completed, user_id
   FROM todos
   WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const todo = result.rows[0];
    return {
      id: todo.id,
      title: todo.title,
      isCompleted: todo.is_completed,
      userId: todo.user_id,
    };
  } catch (error) {
    console.error("Error getting todo by id:", error);
    throw error;
  }
}

export async function deleteTodoById(
  id: string,
  userId: string
): Promise<boolean> {
  try {
    const query = `DELETE FROM todos
  WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);

    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
}

export async function updateTodo(
  id: string,
  userId: string,
  updates: { title?: string; isCompleted?: boolean }
): Promise<Todo | null> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }

    if (updates.isCompleted !== undefined) {
      fields.push(`is_completed = $${paramIndex++}`);
      values.push(updates.isCompleted);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id, userId);

    const query = `UPDATE todos
   SET ${fields.join(", ")}
   WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
   RETURNING id, title, is_completed, user_id`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    const todo = result.rows[0];
    return {
      id: todo.id,
      title: todo.title,
      isCompleted: todo.is_completed,
      userId: todo.user_id,
    };
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
}
