import pg from "pg";
import { config } from "./env.js";
import { error } from "console";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (error) => {
  console.error("Unexpected database error:", error);
  process.exit(-1);
});
