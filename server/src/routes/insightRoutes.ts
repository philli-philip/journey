import { FastifyInstance } from "fastify";
import db from "../db/db";
import { randomID } from "@shared/randomID";

export default async function insightRoutes(fastify: FastifyInstance) {
  fastify.get("/insights", (request, reply) => {
    const { type } = request.query as { type?: string };
    try {
      const rows = db.prepare(
        `SELECT * FROM insights WHERE deletedAt IS NULL${
          type ? " AND type = ?" : ""
        } ORDER BY updatedAt DESC`
      ).all(type ? [type] : []);
      reply.send(rows);
    } catch (err: any) {
      return reply.code(500).send({ message: "Error fetching insights" });
    }
  });

  fastify.get("/insights/:id", (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const row = db.prepare("SELECT * FROM insights WHERE id = ?").get(id);
      if (!row) {
        return reply.code(404).send({ error: "Insight not found" });
      }
      reply.send(row);
    } catch (err: any) {
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post("/insights", async (request, reply) => {
    const id = randomID();
    const { title, description, type } = request.body as {
      title: string;
      description: string;
      type: string;
    };

    try {
      db.prepare(
        "INSERT INTO insights (id, title, description, type) VALUES (?, ?, ?, ?)"
      ).run(id, title, description, type);
      reply.status(201).send({ id, title, description, type });
    } catch (err: any) {
      console.error("Error creating insight:", err);
      reply.status(500).send({ message: "Error creating insight" });
    }
  });

  fastify.put("/insights/:id", (request, reply) => {
    const { id } = request.params as { id: string };
    const { title, description, type } = request.body as {
      title?: string;
      description?: string;
      type?: string;
    };

    const fields: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (type !== undefined) {
      fields.push("type = ?");
      values.push(type);
    }

    if (fields.length === 0) {
      return reply.code(400).send({ message: "No fields provided to update" });
    }

    try {
      const result = db.prepare(
        `UPDATE insights SET ${fields.join(
          ", "
        )}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`
      ).run(...values, id);

      if (result.changes === 0) {
        return reply.code(404).send({ message: "Insight not found" });
      }
      return reply.code(200).send({ message: "Insight updated successfully" });
    } catch (err: any) {
      return reply
        .code(500)
        .send({ message: "Error updating insight: " + err.message });
    }
  });

  fastify.delete("/insights/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const result = db.prepare(
        "UPDATE insights SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?"
      ).run(id);

      if (result.changes === 0) {
        return reply.code(404).send({ message: "Insight not found" });
      }
      return reply.code(200).send({ message: "Insight soft-deleted successfully" });
    } catch (err: any) {
      return reply.code(500).send({ message: "Error soft-deleting insight" });
    }
  });

  fastify.get("/steps/:stepId/insights", (request, reply) => {
    const { stepId } = request.params as { stepId: string };
    const { type } = request.query as { type?: string };

    let query = `
      SELECT i.* FROM insights i
      JOIN step_connections sc ON i.id = sc.attributeId
      WHERE sc.stepId = ? AND sc.attributeType = 'insight' AND i.deletedAt IS NULL
    `;
    const params: any[] = [stepId];

    if (type) {
      query += ` AND i.type = ?`;
      params.push(type);
    }

    try {
      const rows = db.prepare(query).all(...params);
      reply.send(rows);
    } catch (err: any) {
      console.error("Database error:", err);
      return reply.code(500).send({ error: "Error fetching insights for step" });
    }
  });
}
