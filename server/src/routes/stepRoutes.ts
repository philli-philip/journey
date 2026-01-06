import { FastifyInstance } from "fastify";
import db from "../db/db";
import { randomID } from "@shared/randomID";

export default async function stepRoutes(fastify: FastifyInstance) {
  fastify.post("/journeys/:journeyId/steps", async (request, reply) => {
    const { journeyId } = request.params as {
      journeyId: string;
    };

    const id = randomID();
    try {
      db.prepare("INSERT INTO steps (id, journeyID, name) VALUES (?,?,?)").run(
        id,
        journeyId,
        "New Step"
      );

      // Fetch the current orderedStepIds from the journey
      interface JourneyOrderedSteps {
        orderedStepIds: string;
      }

      const journey = db
        .prepare("SELECT orderedStepIds FROM user_journeys WHERE id = ?")
        .get(journeyId) as JourneyOrderedSteps | undefined;

      let orderedStepIds: string[] = [];
      if (journey && journey.orderedStepIds) {
        orderedStepIds = JSON.parse(journey.orderedStepIds);
      }
      orderedStepIds.push(id);

      // Update the journey with the new orderedStepIds
      db.prepare(
        "UPDATE user_journeys SET orderedStepIds = ? WHERE id = ?"
      ).run(JSON.stringify(orderedStepIds), journeyId);

      return reply.code(201).send({ id, message: "Step created successfully" });
    } catch (err: any) {
      console.error("Error creating step:", err);
      reply.code(500).send({ message: "Error creating step" });
    }
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
    const values: any[] = [];

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

    try {
      const result = db
        .prepare(
          `UPDATE steps SET ${fields.join(
            ", "
          )}, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND journeyId = ?`
        )
        .run(...values, stepId, journeyId);

      if (result.changes === 0) {
        return reply.code(404).send({
          message: "Step not found or does not belong to the specified journey",
        });
      }
      return reply.code(200).send({ message: "Step updated successfully" });
    } catch (err: any) {
      console.error("Error updating step:", err);
      reply.code(500).send({ message: "Error updating step" });
    }
  });

  fastify.delete("/steps/:stepId", async (request, reply) => {
    const { stepId } = request.params as {
      stepId: string;
    };

    try {
      const result = db.prepare("DELETE from steps WHERE id = ?").run(stepId);
      if (result.changes === 0) {
        return reply.code(404).send({
          message: "Step not found or does not belong to the specified journey",
        });
      }
      return reply.code(200).send({ message: "Step deleted successfully" });
    } catch (err: any) {
      console.error("Error deleting step:", err);
      reply.code(500).send({ message: "Error deleting step" });
    }
  });

  fastify.delete(
    "/steps/:stepId/insights/:insightId",
    async (request, reply) => {
      const { stepId, insightId } = request.params as {
        stepId: string;
        insightId: string;
      };

      try {
        const result = db
          .prepare(
            "DELETE from step_connections WHERE stepId = ? AND attributeID = ?"
          )
          .run(stepId, insightId);

        if (result.changes === 0) {
          return reply.code(404).send({
            message:
              "Step connections not found or does not belong to the specified step",
          });
        }
        return reply
          .code(200)
          .send({ message: "Step connections deleted successfully" });
      } catch (err: any) {
        console.error("Error deleting step connection:", err);
        reply.code(500).send({ message: "Error deleting step connection" });
      }
    }
  );
}
