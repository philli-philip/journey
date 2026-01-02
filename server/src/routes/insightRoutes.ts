import { FastifyInstance } from "fastify";
import db from "../db";
import { randomID } from "@shared/randomID";

export default async function insightRoutes(fastify: FastifyInstance) {
  fastify.get("/insights", (request, reply) => {
    const { type } = request.query as { type?: string };
    db.all(
      `SELECT * FROM insights WHERE deletedAt IS NULL${
        type ? ` AND type = '${type}'` : ""
      } ORDER BY updatedAt DESC`,
      [],
      function (this, err, rows) {
        if (err) {
          return reply.code(500).send({ message: "Error fetching insights" });
        }
        reply.send(rows);
      }
    );
  });

  fastify.get("/insights/:id", (request, reply) => {
    const { id } = request.params as { id: string };
    db.get("SELECT * FROM insights WHERE id = ?", [id], function (err, row) {
      if (err) {
        return reply.code(500).send({ error: "Internal Server Error" });
      }
      if (!row) {
        return reply.code(404).send({ error: "Insight not found" });
      }
      reply.send(row);
    });
  });

  fastify.post("/insights", async (request, reply) => {
    const id = randomID();
    const { title, description, type } = request.body as {
      title: string;
      description: string;
      type: string;
    };

    db.run(
      "INSERT INTO insights (id, title, description, type) VALUES (?, ?, ?, ?)",
      [id, title, description, type],
      function (this, err) {
        if (err) {
          throw new Error("Error creating insight");
        }
        reply.status(201);
        return { id, title, description, type };
      }
    );
    return { id: title, description, type };
  });

  fastify.put("/insights/:id", (request, reply) => {
    const { id } = request.params as { id: string };
    const { title, description, type } = request.body as {
      title?: string;
      description?: string;
      type?: string;
    };

    const fields: string[] = [];
    const values: (string | string[])[] = [];

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

    db.run(
      `UPDATE insights SET ${fields.join(
        ", "
      )}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id],
      function (err) {
        if (err) {
          return reply
            .code(500)
            .send({ message: "Error updating insight" + err.message });
        }
        return reply
          .code(200)
          .send({ message: "Insight updated successfully" });
      }
    );
  });

  fastify.delete("/insights/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    db.run(
      "UPDATE insights SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
      function (this, err) {
        if (err) {
          return reply
            .code(500)
            .send({ message: "Error soft-deleting insight" });
        }
        if (this.changes === 0) {
          return reply.code(404).send({ message: "Insight not found" });
        }
      }
    );
    return reply
      .code(200)
      .send({ message: "Insight soft-deleted successfully" });
  });

  fastify.get("/steps/:stepId/insights", (request, reply) => {
    const { stepId } = request.params as { stepId: string };
    const { type } = request.query as { type?: string };

    let query = `
      SELECT i.* FROM insights i
      JOIN step_connections sc ON i.id = sc.attributeId
      WHERE sc.stepId = ? AND sc.attributeType = 'insight' AND i.deletedAt IS NULL
    `;
    const params: (string | string[])[] = [stepId];

    if (type) {
      query += ` AND i.type = ?`;
      params.push(type);
    }

    db.all(query, params, function (err, rows) {
      if (err) {
        console.error("Database error:", err);
        return reply
          .code(500)
          .send({ error: "Error fetching insights for step" });
      }
      reply.send(rows);
    });
  });
}
