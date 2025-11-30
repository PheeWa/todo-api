import bcrypt from "bcrypt";

interface User {
  username: string;
  password: string;
}

// a hashPasswords function previously defined to generate the hash for passwords for both admin and user now used here
const users: User[] = [
  {
    username: "alice",
    password: "$2b$10$KQC/rQL.EGE/adX1Gnb8ceJ2Q79NXpuhjKfB3S3HG0udwl4vQKU2q",
  },
  {
    username: "bob",
    password: "$2b$10$YNP7HfQn.cjJsH5ETlGMPuTnvJIbewNFfKyA2C/xXck.PjKX3xJ8y",
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

const tokens = new Map<string, { username: string }>();

// Generate a token
function generateToken() {
  return crypto.randomUUID();
}

// Create and store a token for user
export function createToken(username: string) {
  const token = generateToken();
  tokens.set(token, { username });
  return token;
}

// Validate a token and return the username if valid
export function validateToken(token: string): { username: string } | undefined {
  return tokens.get(token);
}

// Utility function to hash passwords for user registration and password updates
// Currently used for generating test user password hashes
// TODO: Set up User registration (hashing passwords before storing) and Password reset/change functionality
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
