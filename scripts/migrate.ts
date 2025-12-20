import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { pool } from "../config/database.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

async function runMigration() {
  try {
    console.log("Starting database migrations...");

    const migrationsDir = path.join(_dirname, "../migrations");
    const files = await fs.readdir(migrationsDir);

    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      console.log(`Running migration: ${file}`);
      const sql = await fs.readFile(path.join(migrationsDir, file), "utf-8");
      await pool.query(sql);
      console.log(`Completed: ${file}`);
    }

    console.log("All migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
