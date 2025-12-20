const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is not set. Please check your .env file."
  );
}

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Plase check your .env fileURLToPath."
  );
}

export const config = {
  jwtSecret: JWT_SECRET,
  databaseUrl: DATABASE_URL,
  port: parseInt(process.env.PORT || "8080", 10),
  host: process.env.HOST || "0.0.0.0",
} as const;
