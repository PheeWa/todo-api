import "dotenv/config";
import { pool } from "../config/database.js";
import bcrypt from "bcrypt";
import { hashPassword } from "../services/auth.js";

const testUsers = [
  {
    userId: "550e8400-e29b-41d4-a716-446655440001",
    username: "alice",
    password: "admin123",
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440002",
    username: "bob",
    password: "user123",
  },
];

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    for (const user of testUsers) {
      const checkQuery = "SELECT * FROM users WHERE user_id = $1";
      const checkResult = await pool.query(checkQuery, [user.userId]);

      if (checkResult.rows.length > 0) {
        console.log(`✓ User '${user.username}' already exists, skipping.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const insertQuery = `INSERT INTO users (user_id, username, password)
      VALUES ($1, $2, $3)`;
      await pool.query(insertQuery, [
        user.userId,
        user.username,
        hashedPassword,
      ]);

      console.log(`✓ Created user '${user.username}'`);
    }

    console.log("\nDatabase seeding completed successfully!");
    console.log("\nTest credentials:");
    console.log("- alice / admin123");
    console.log("- bob / user123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
