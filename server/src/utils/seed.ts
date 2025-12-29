import db from "../db";
import { mockUserJourneys } from "../mockdata/mockJourneys";
import { mockInsights } from "../mockdata/mockInsights";

db.serialize(() => {
  console.log("Seeding database ...");
  db.run("DELETE FROM user_journeys"); // Clear existing data
  db.run("DELETE FROM insights"); // Clear existing data

  const stmtJourneys = db.prepare(
    "INSERT INTO user_journeys (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)"
  );

  mockUserJourneys.forEach((journey) => {
    stmtJourneys.run(
      journey.id,
      journey.name,
      journey.description,
      journey.createdAt,
      journey.updatedAt
    );
  });

  stmtJourneys.finalize();

  const stmtInsights = db.prepare(
    "INSERT INTO insights (id, title, description, type) VALUES (?, ?,?, ?)"
  );

  mockInsights.forEach((insight) => {
    stmtInsights.run(
      insight.id,
      insight.title,
      insight.description,
      insight.type
    );
  });

  stmtInsights.finalize();

  console.log("Database seeded successfully.");
});
