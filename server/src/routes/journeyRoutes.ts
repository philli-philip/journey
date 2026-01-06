import { FastifyInstance } from "fastify";
import db from "../db/db";
import { randomID } from "@shared/randomID";
import type { updateJourneyDto } from "@shared/Dto/journey.types";
import { buildFieldValueClause } from "src/utils/sql-helper";

export default async function journeyRoutes(fastify: FastifyInstance) {
  fastify.get("/journeys", (request, reply) => {
    const { personaSlug } = request.query as { personaSlug?: string };

    db.all(
      `SELECT * FROM user_journeys WHERE deletedAt IS NULL ${
        personaSlug ? "AND personaSlugs LIKE ?" : ""
      }`,
      personaSlug ? [`%${personaSlug}%`] : [],
      (err, rows) => {
        if (err) {
          console.log("Error fetching journeys: ", err);
          reply.code(500).send({ message: "Error fetching journeys:", err });
        }
        reply.status(200).send(rows);
      }
    );
  });

  fastify.post("/journeys", async (request, reply) => {
    const id = randomID();
    const title = "New journey";
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO user_journeys (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
        [id, title, "", createdAt, updatedAt],
        function (err) {
          if (err) {
            reply.code(500).send({ message: "Error creating journey" });
            reject(err);
          }
          reply.code(201).send({
            id,
            name: title,
            description: "",
            steps: [],
            createdAt,
            updatedAt,
          });
          resolve({
            id,
            name: title,
            description: "",
            steps: [],
            createdAt,
            updatedAt,
          });
        }
      );
    });
  });

  fastify.get("/journeys/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
          uj.id AS id,
          uj.name AS name,
          uj.description AS description,
          uj.createdAt AS createdAt,
          uj.updatedAt AS updatedAt,
          uj.deletedAt AS deletedAt,
          uj.orderedStepIds AS orderedStepIds,
          (SELECT json_group_array(json_object('slug', p.slug, 'name', p.name)) FROM json_each(uj.personaSlugs) AS je JOIN personas p ON p.slug = je.value AND p.deletedAt IS NULL) AS personas,
          (
            SELECT
              json_group_array(
                json_object(
                  'id', s.id,
                  'name', s.name,
                  'description', s.description,
                  'attributes', json_object(
                    'services', (SELECT json_group_array(json_object('id', i.id, 'title', i.title, 'description', i.description)) FROM insights i JOIN step_connections sc ON i.id = sc.attributeId WHERE sc.stepId = s.id AND sc.attributeType = 'service' AND i.deletedAt IS NULL),
                    'pains', (SELECT json_group_array(json_object('id', i.id, 'title', i.title, 'description', i.description)) FROM insights i JOIN step_connections sc ON i.id = sc.attributeId WHERE sc.stepId = s.id AND sc.attributeType = 'insight' AND i.type = 'pain' AND i.deletedAt IS NULL),
                    'needs', (SELECT json_group_array(json_object('id', i.id, 'title', i.title, 'description', i.description)) FROM insights i JOIN step_connections sc ON i.id = sc.attributeId WHERE sc.stepId = s.id AND sc.attributeType = 'insight' AND i.type = 'need' AND i.deletedAt IS NULL),
                    'gains', (SELECT json_group_array(json_object('id', i.id, 'title', i.title, 'description', i.description)) FROM insights i JOIN step_connections sc ON i.id = sc.attributeId WHERE sc.stepId = s.id AND sc.attributeType = 'insight' AND i.type = 'gain' AND i.deletedAt IS NULL),
                    'observations', (SELECT json_group_array(json_object('id', i.id, 'title', i.title, 'description', i.description)) FROM insights i JOIN step_connections sc ON i.id = sc.attributeId WHERE sc.stepId = s.id AND sc.attributeType = 'insight' AND i.type = 'observation' AND i.deletedAt IS NULL)
                  ),
                  'imageId', s.imageId
                )
              )
            FROM
              json_each(uj.orderedStepIds) AS je
            JOIN
              steps AS s ON s.id = je.value
            WHERE
              s.journeyId = uj.id
            ORDER BY
              je.key
          ) AS steps
        FROM
          user_journeys AS uj
        WHERE
          uj.id = ?`,
        [id],
        (err, row: { personas: string; steps: string }) => {
          if (err) {
            reply.code(500).send({ message: "Error fetching journey" });
            reject(err);
          }
          if (!row) {
            return reply.code(404).send({ message: "Journey not found" });
          }
          // Parse JSON strings into objects
          if (row.personas) {
            row.personas = JSON.parse(row.personas);
          }
          if (row.steps) {
            row.steps = JSON.parse(row.steps);
          }
          return reply.code(200).send(row);
        }
      );
    });
  });

  fastify.put("/journeys/:id", (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as updateJourneyDto["updates"];

    const { fields: personaFields, values: personaValues } =
      buildFieldValueClause({
        updates,
        updatedAt: true,
      });

    db.run(
      `UPDATE user_journeys SET ${personaFields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ? RETURNING *`,
      [...personaValues, id],
      function (err) {
        if (err) {
          reply
            .code(500)
            .send({ message: "Error updating journey" + err.message });
        }
        reply.code(200).send("Journey updated successfully");
      }
    );
  });

  fastify.delete("/journeys/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE user_journeys SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [id],
        function (err) {
          if (err) {
            reply.code(500).send({ message: "Error soft-deleting journey" });
            reject(err);
          }
          if (this.changes === 0) {
            reply.code(404).send({ message: "Journey not found" });
            resolve(null);
          }
          reply
            .code(200)
            .send({ message: "Journey soft-deleted successfully" });
          resolve({ message: "Journey soft-deleted successfully" });
        }
      );
    });
  });

  fastify.put("/journeys/:id/restore", async (request, reply) => {
    const { id } = request.params as { id: string };
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE user_journeys SET deletedAt = NULL, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [id],
        function (err) {
          if (err) {
            reply.code(500).send({ message: "Error restoring journey" });
            reject(err);
          }
          if (this.changes === 0) {
            reply.code(404).send({ message: "Journey not found" });
            resolve(null);
          }
          reply.code(200).send({ message: "Journey restored successfully" });
          resolve({ message: "Journey restored successfully" });
        }
      );
    });
  });
}
