import { FastifyInstance } from "fastify";
import db from "../db";
import { randomID } from "@shared/randomID";

export default async function stepRoutes(fastify: FastifyInstance) {
  fastify.post("/journeys/:journeyId/steps", async (request, reply) => {
    const { journeyId } = request.params as {
      journeyId: string;
    };

    const newStepId = await new Promise<string>((resolve, reject) => {
      const id = randomID();
      db.run(
        "INSERT INTO steps (id, journeyID, name) VALUES (?,?,?)",
        [id, journeyId, "New Step"],
        function (err) {
          if (err) {
            return reject(err);
          }
          resolve(id);
        }
      );
    });

    // Fetch the current orderedStepIds from the journey
    const journey = await new Promise<any>((resolve, reject) => {
      db.get(
        "SELECT orderedStepIds FROM user_journeys WHERE id = ?",
        [journeyId],
        (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row);
        }
      );
    });

    let orderedStepIds: string[] = [];
    if (journey && journey.orderedStepIds) {
      orderedStepIds = JSON.parse(journey.orderedStepIds);
    }
    orderedStepIds.push(newStepId);

    // Update the journey with the new orderedStepIds
    await new Promise<void>((resolve, reject) => {
      db.run(
        "UPDATE user_journeys SET orderedStepIds = ? WHERE id = ?",
        [JSON.stringify(orderedStepIds), journeyId],
        function (err) {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });

    return reply
      .code(201)
      .send({ id: newStepId, message: "Step created successfully" });
  });

  fastify.put("/journeys/:journeyId/steps/:stepId", async (request, reply) => {
    const { journeyId, stepId } = request.params as {
      journeyId: string;
      stepId: string;
    };

    const { name, description, insights, pains, services } = request.body as {
      name?: string;
      description?: string;
      insights?: string;
      pains?: string;
      services?: string;
    };

    const fields: string[] = [];
    const values: (string | object)[] = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (pains !== undefined) {
      fields.push("painPoints = ?");
      values.push(pains);
    }
    if (insights !== undefined) {
      fields.push("insights = ?");
      values.push(insights);
    }
    if (services !== undefined) {
      fields.push("services = ?");
      values.push(services);
    }

    if (fields.length === 0) {
      reply.code(400).send({ message: "No fields provided to update" });
      return;
    }

    const changes = await new Promise<number>((resolve, reject) => {
      db.run(
        `UPDATE steps SET ${fields.join(
          ", "
        )}, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND journeyId = ?`,
        [...values, stepId, journeyId],
        function (err) {
          if (err) {
            return reject(err);
          }
          resolve(this.changes);
        }
      );
    });

    if (changes === 0) {
      return reply.code(404).send({
        message: "Step not found or does not belong to the specified journey",
      });
    }
    return reply.code(200).send({ message: "Step updated successfully" });
  });

  fastify.delete(
    "/journeys/:journeyId/steps/:stepId",
    async (request, reply) => {
      const { journeyId, stepId } = request.params as {
        journeyId: string;
        stepId: string;
      };

      const changes = await new Promise<number>((resolve, reject) => {
        db.run(
          `
      DELETE from steps
      WHERE id = ?
      `,
          [stepId],
          function (err) {
            if (err) {
              return reject(err);
            }
            resolve(this.changes);
          }
        );
      });
      if (changes === 0) {
        return reply.code(404).send({
          message: "Step not found or does not belong to the specified journey",
        });
      }
      return reply.code(200).send({ message: "Step deleted successfully" });
    }
  );
}
