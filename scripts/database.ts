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

console.log("Choose an action:");
console.log("1. Migrate database");
console.log("2. Drop database");

process.stdout.write("Enter your choice (1 or 2): ");
process.stdin.resume();
process.stdin.setEncoding("utf-8");

process.stdin.on("data", (input: string) => {
  const choice = input.trim();

  if (choice === "1") {
    console.log("Generating database schema...");
    runCommand("npx drizzle-kit generate");

    console.log("Migrating database...");
    runCommand("npx drizzle-kit migrate");

    console.log("Database migration completed successfully.");
    process.exit(0);
  } else if (choice === "2") {
    console.log("Dropping database...");
    runCommand("npx drizzle-kit drop");

    console.log("Database dropped successfully.");
    process.exit(0);
  } else {
    console.log("Invalid choice, please choose 1 or 2.");
    process.exit(1);
  }
});
