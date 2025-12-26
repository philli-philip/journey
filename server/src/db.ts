import sqlite3 from "sqlite3";
import {
  CREATE_USER_JOURNEYS_TABLE,
  CREATE_STEPS_TABLE,
  CREATE_MIGRATIONS_TABLE,
} from "./schema";

const db = new sqlite3.Database("./journey.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    db.run(CREATE_MIGRATIONS_TABLE);
    db.run(CREATE_USER_JOURNEYS_TABLE);
    db.run(CREATE_STEPS_TABLE);
  }
});

export default db;
