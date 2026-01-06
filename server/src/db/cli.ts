import { Migrator } from "./migrator";
import path from "path";

const command = process.argv[2];
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
