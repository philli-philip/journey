import db from "../db";
import { mockUserJourneys } from "../mockdata/mockJourneys";

db.serialize(() => {
  db.run("DELETE FROM user_journeys"); // Clear existing data

  const stmt = db.prepare(
    "INSERT INTO user_journeys (id, name, description, steps, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
  );

  mockUserJourneys.forEach((journey) => {
    stmt.run(
      journey.id,
      journey.name,
      journey.description,
      JSON.stringify(journey.steps),
      journey.createdAt,
      journey.updatedAt
    );
  });

  stmt.finalize();
  console.log("Database seeded successfully.");
});
