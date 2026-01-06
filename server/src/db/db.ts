import Database from "better-sqlite3";

const db = new Database("./journey.db");

console.log("Connected to the SQLite database via better-sqlite3.");

export default db;
