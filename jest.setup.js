// Set up test environment variables
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key";
process.env.DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";

// Load environment variables from .env file (if it exists)
import "dotenv/config";
