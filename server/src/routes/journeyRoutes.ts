import { FastifyInstance } from "fastify";
import db from "../db";
import { randomID } from "@shared/randomID";

export default async function journeyRoutes(fastify: FastifyInstance) {
  fastify.get("/journeys", async (request, reply) => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM user_journeys WHERE deletedAt IS NULL",
        [],
        (err, rows) => {
          if (err) {
            reply.code(500).send({ message: "Error fetching journeys" });
            reject(err);
          }
          return reply.status(200).send(rows);
        }
      );
    });
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
        (err, row) => {
          if (err) {
            reply.code(500).send({ message: "Error fetching journey" });
            reject(err);
          }
          if (!row) {
            return reply.code(404).send({ message: "Journey not found" });
          }
          return reply.code(200).send(row);
        }
      );
    });
  });

  fastify.put("/journeys/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, description, stepOrder } = request.body as {
      name?: string;
      description?: string;
      stepOrder?: string[];
    };

    const fields: string[] = [];
    const values: (string | string[])[] = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }

    if (stepOrder !== undefined) {
      fields.push("orderedStepIds = ?");
      if (Array.isArray(stepOrder)) {
        values.push(JSON.stringify(stepOrder));
      } else if (typeof stepOrder === "string") {
        values.push(stepOrder);
      } else {
        // Handle unexpected type, perhaps log an error or send a bad request response
        fastify.log.warn("Unexpected type for stepOrder: " + typeof stepOrder);
        reply.code(400).send({ message: "Invalid type for stepOrder" });
        return;
      }
      fastify.log.info({ stepOrder });
    }

    if (fields.length === 0) {
      reply.code(400).send({ message: "No fields provided to update" });
      return;
    }

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE user_journeys SET ${fields.join(
          ", "
        )}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [...values, id],
        function (err) {
          if (err) {
            reply
              .code(500)
              .send({ message: "Error updating journey" + err.message });
            reject(err);
          }
          reply.code(200).send({ message: "Journey updated successfully" });
          resolve({ message: "Journey updated successfully" });
        }
      );
    });
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
