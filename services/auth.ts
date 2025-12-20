import bcrypt from "bcrypt";
import { pool } from "../config/database.js";

interface UserData {
  userId: string;
  username: string;
  password: string;
}

// Utility function to hash passwords for user registration and password updates
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function registerUser(
  username: string,
  password: string
): Promise<UserData | undefined> {
  try {
    const checkQuery = "SELECT * FROM users WHERE LOWER(username) = LOWER($1)";
    const checkResult = await pool.query(checkQuery, [username]);

    if (checkResult.rows.length > 0) {
      return undefined;
    }

    const hashedPassword = await hashPassword(password);

    const userId = crypto.randomUUID();
    const insertQuery = `INSERT INTO users (user_id, username, password)
    VALUES ($1, $2, $3)
    RETURNING user_id, username, password`;

    const insertResult = await pool.query(insertQuery, [
      userId,
      username,
      hashedPassword,
    ]);

    const newUser = insertResult.rows[0];
    return {
      userId: newUser.user_id,
      username: newUser.username,
      password: newUser.password,
    };
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<UserData | undefined> {
  try {
    const query = "SELECT * FROM users WHERE LOWER(username) = LOWER($1)";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return undefined;
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return undefined;
    }

    return {
      userId: user.user_id,
      username: user.username,
      password: user.password,
    };
  } catch (error) {
    console.error("Error authenticating user: ", error);
    throw error;
  }
}
