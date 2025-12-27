export const CREATE_USER_JOURNEYS_TABLE = `
  CREATE TABLE IF NOT EXISTS user_journeys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    orderedStepIds TEXT DEFAULT '[]',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL
  )
`;

export const CREATE_STEPS_TABLE = `
  CREATE TABLE IF NOT EXISTS steps (
    id TEXT PRIMARY KEY NOT NULL,
    journeyId TEXT NOT NULL,
    name TEXT DEFAULT 'New Step',
    description TEXT,
    painPoints TEXT,
    insights TEXT,
    services TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL,
    FOREIGN KEY (journeyId) REFERENCES user_journeys(id)
  )
`;
