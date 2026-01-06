import { Migration } from "../migrator";

export const migration: Migration = {
  id: 1,
  name: "initial-setup",
  up: (db) => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_journeys (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            personaSlugs TEXT DEFAULT '[]',
            orderedStepIds TEXT DEFAULT '[]',
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
            deletedAt TEXT DEFAULT NULL
        )
`);
    db.exec(`
  CREATE TABLE IF NOT EXISTS steps (
    id TEXT PRIMARY KEY NOT NULL,
    journeyId TEXT NOT NULL,
    name TEXT DEFAULT 'New Step',
    imageId TEXT,
    description TEXT,
    painPoints TEXT,
    insights TEXT,
    services TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL,
    FOREIGN KEY (journeyId) REFERENCES user_journeys(id),
    FOREIGN KEY (imageId) REFERENCES images(id)
  )
`);
    db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY NOT NULL,
    imageData BLOB NOT NULL,
    filename TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    size INTEGER NOT NULL,
    altText TEXT,
    originalImage BLOB NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL
  )
`);
    db.exec(`
  CREATE TABLE IF NOT EXISTS insights (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT DEFAULT 'New Insight',
    description TEXT,
    type TEXT CHECK ( type IN ('pain', 'gain', 'need', 'observation')) NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL
  )
`);
    db.exec(`
  CREATE TABLE IF NOT EXISTS step_connections (
    id TEXT PRIMARY KEY NOT NULL,
    stepId TEXT NOT NULL,
    attributeId TEXT NOT NULL,
    attributeType TEXT NO NULL CHECK ( attributeType in ('insight', 'service')) DEFAULT 'insight',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL,
    FOREIGN KEY (stepId) REFERENCES steps(id)
)
`);
    db.exec(`
  CREATE TABLE IF NOT EXISTS personas (
    slug TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL DEFAULT 'New Persona' ,
    description TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL
  )
`);
  },
  down: (db) => {
    db.exec("DROP TABLE IF EXISTS migrations");
    db.exec("DROP TABLE IF EXISTS personas");
    db.exec("DROP TABLE IF EXISTS insights");
    db.exec("DROP TABLE IF EXISTS step_connections");
    db.exec("DROP TABLE IF EXISTS steps");
    db.exec("DROP TABLE IF EXISTS user_journeys");
    db.exec("DROP TABLE IF EXISTS images");
  },
};
