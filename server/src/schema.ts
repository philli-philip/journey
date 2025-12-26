export const CREATE_USER_JOURNEYS_TABLE = `
  CREATE TABLE IF NOT EXISTS user_journeys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL
  )
`;

export const CREATE_STEPS_TABLE = `
  CREATE TABLE IF NOT EXISTS steps (
    id TEXT PRIMARY KEY,
    name TEXT DEFAULT 'New Step',
    description TEXT,
    journeyId TEXT NOT NULL,
    painPoints TEXT,
    insights TEXT,
    services TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL,
    FOREIGN KEY (journeyId) REFERENCES user_journeys(id)
  )
`;

export const CREATE_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    appliedAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;
