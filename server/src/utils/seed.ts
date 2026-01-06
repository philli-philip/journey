import db from "../db/db";
import { mockUserJourneys } from "../mockdata/mockJourneys";
import { mockInsights } from "../mockdata/mockInsights";
import { mockConnections } from "../mockdata/mockConnections";
import { mockPersona } from "src/mockdata/mockPersona";
import { createPersona } from "src/controllers/personaController";
import { createInsight } from "src/controllers/insightController";

console.log("Seeding database ...");

// Delete in order to respect foreign key constraints
db.prepare("DELETE FROM step_connections").run();
db.prepare("DELETE FROM steps").run();
db.prepare("DELETE FROM user_journeys").run();
db.prepare("DELETE FROM insights").run();
db.prepare("DELETE FROM personas").run();
db.prepare("DELETE FROM images").run();

const stmtJourneys = db.prepare(
  "INSERT INTO user_journeys (id, name, description, personaSlugs, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
);

const stmtSteps = db.prepare(
  "INSERT INTO steps (id, journeyId, name, description, painPoints, insights, services) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

mockUserJourneys.forEach((journey) => {
  stmtJourneys.run(
    journey.id,
    journey.name,
    journey.description,
    JSON.stringify(journey.personas.map((p) => p.slug)),
    journey.createdAt,
    journey.updatedAt
  );

  if (journey.steps) {
    journey.steps.forEach((step) => {
      stmtSteps.run(
        step.id,
        journey.id,
        step.name,
        step.description,
        step.attributes?.pains || "",
        step.attributes?.insights || "",
        step.attributes?.services || ""
      );
    });
  }
});

mockInsights.forEach(async (insight) => {
  await createInsight({
    title: insight.title,
    description: insight.description || "",
    type: insight.type,
  });
});

const stmtConnections = db.prepare(
  "INSERT INTO step_connections (id, stepId, attributeId, attributeType, createdAt) VALUES (?, ?, ?, ?, ?)"
);

mockConnections.forEach((connection) => {
  stmtConnections.run(
    connection.id,
    connection.stepId,
    connection.attributeId,
    connection.attributeType,
    connection.createdAt
  );
});

mockPersona.forEach((persona) => {
  createPersona({
    slug: persona.slug,
    name: persona.name,
    description: persona.description,
  });
});

console.log("Database seeded successfully.");
