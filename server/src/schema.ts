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
`;

export const CREATE_IMAGES_TABLE = `
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
`;

export const CREATE_INSIGHTS_TABLE = `
  CREATE TABLE IF NOT EXISTS insights (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT DEFAULT 'New Insight',
    description TEXT,
    type TEXT CHECK ( type IN ('pain', 'gain', 'need', 'observation')) NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL
  )
`;

export const CREATE_STEP_CONNECTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS step_connections (
    id TEXT PRIMARY KEY NOT NULL,
    stepId TEXT NOT NULL,
    attributeId TEXT NOT NULL,
    attributeType TEXT NO NULL CHECK ( attributeType in ('insight', 'service')) DEFAULT 'insight',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    deletedAt TEXT DEFAULT NULL,
    FOREIGN KEY (stepId) REFERENCES steps(id)
  )

`;
