import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./journey.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

export default db;
