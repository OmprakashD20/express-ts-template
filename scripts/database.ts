import dotenv from "dotenv";
import { execSync } from "child_process";

function runCommand(command: string) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

const env = process.argv[2] || "development";

dotenv.config({ path: `.env.${env}` });

console.log("Generating database schema...");
runCommand("npx drizzle-kit generate");

console.log("Migrating database...");
runCommand("npx drizzle-kit migrate");

console.log("Database generation and migration completed successfully.");
