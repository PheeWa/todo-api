import bcrypt from "bcrypt";

interface UserData {
  username: string;
  password: string;
}

// a hashPasswords function previously defined to generate the hash for passwords for both admin and user now used here
const users: UserData[] = [
  {
    username: "alice",
    password: "$2b$10$KQC/rQL.EGE/adX1Gnb8ceJ2Q79NXpuhjKfB3S3HG0udwl4vQKU2q",
  },
  {
    username: "bob",
    password: "$2b$10$YNP7HfQn.cjJsH5ETlGMPuTnvJIbewNFfKyA2C/xXck.PjKX3xJ8y",
  },
];

// Utility function to hash passwords for user registration and password updates
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function registerUser(
  username: string,
  password: string
): Promise<UserData | undefined> {
  const foundUser = users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );

  if (foundUser) {
    return undefined;
  }

  const hashedPassword = await hashPassword(password);

  const newUser: UserData = {
    username,
    password: hashedPassword,
  };

  users.push(newUser);

  return newUser;
}

export async function findUser(
  username: string,
  password: string
): Promise<UserData | undefined> {
  const user = users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );

  if (!user) {
    return undefined;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return undefined;
  }

  return user;
}
