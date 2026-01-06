import { Migrator } from "./migrator";
import path from "path";

import { fileURLToPath } from "url";

const command = process.argv[2];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrator = new Migrator(path.join(__dirname, "migrations"));

async function run() {
  switch (command) {
    case "migrate":
      await migrator.runMigrations();
      break;
    case "rollback":
      await migrator.rollback();
      break;
    default:
      console.log("Usage: npm run migrate or npm run migrate:rollback");
  }
  process.exit(0);
}

run();
