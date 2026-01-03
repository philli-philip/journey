import sqlite3 from "sqlite3";
import {
  CREATE_USER_JOURNEYS_TABLE,
  CREATE_STEPS_TABLE,
  CREATE_IMAGES_TABLE,
  CREATE_INSIGHTS_TABLE,
  CREATE_STEP_CONNECTIONS_TABLE,
  CREATE_PERSONA_TABLE,
} from "./schema";

const db = new sqlite3.Database("./journey.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    db.run(CREATE_USER_JOURNEYS_TABLE);
    db.run(CREATE_STEPS_TABLE);
    db.run(CREATE_IMAGES_TABLE);
    db.run(CREATE_INSIGHTS_TABLE);
    db.run(CREATE_STEP_CONNECTIONS_TABLE);
    db.run(CREATE_PERSONA_TABLE);
  }
});

export default db;
