import bcrypt from "bcrypt";
import type { UserRole } from "../types/index.js";

interface User {
  username: string;
  password: string;
  role: UserRole;
}

// a hashPasswords function previously defined to generate the hash for passwords for both admin and user now used here
const users: User[] = [
  {
    username: "admin",
    password: "$2b$10$KQC/rQL.EGE/adX1Gnb8ceJ2Q79NXpuhjKfB3S3HG0udwl4vQKU2q",
    role: "admin",
  },
  {
    username: "user",
    password: "$2b$10$YNP7HfQn.cjJsH5ETlGMPuTnvJIbewNFfKyA2C/xXck.PjKX3xJ8y",
    role: "user",
  },
];

export async function findUser(
  username: string,
  password: string
): Promise<User | undefined> {
  const user = users.find((user) => user.username === username);

  if (!user) {
    return undefined;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return undefined;
  }

  return user;
}

const tokens = new Map<string, { username: string; role: UserRole }>();

// Generate a token
function generateToken() {
  return crypto.randomUUID();
}

// Create and store a token for user
export function createToken(username: string, role: UserRole) {
  const token = generateToken();
  tokens.set(token, { username, role });
  return token;
}

// Validate a token and return the username if valid
export function validateToken(
  token: string
): { username: string; role: UserRole } | undefined {
  return tokens.get(token);
}

// Utility function to hash passwords for user registration and password updates
// Currently used for generating test user password hashes
// TODO: Set up User registration (hashing passwords before storing) and Password reset/change functionality
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
