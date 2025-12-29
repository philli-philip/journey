import { FastifyInstance } from "fastify";
import db from "../db";
import { randomID } from "@shared/randomID";

export default async function insightRoutes(fastify: FastifyInstance) {
  fastify.get("/insights", async (request, reply) => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM insights WHERE deletedAt IS NULL",
        [],
        function (this, err, rows) {
          console.log(this, err);
          if (err) {
            reply.code(500).send({ message: "Error fetching insights" });
            reject(err);
          }
          resolve(rows);
        }
      );
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
          return reply.code(500).send({ message: "Error creating insight" });
        }
        return reply.code(201).send(this);
      }
    );
  });

  fastify.put("/insights/:id", async (request, reply) => {
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
      reply.code(400).send({ message: "No fields provided to update" });
      return;
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
        reply.code(200).send({ message: "Insight updated successfully" });
      }
    );
  });

  fastify.delete("/insights/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    db.run(
      "UPDATE insights SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [id],
      function (err) {
        if (err) {
          return reply
            .code(500)
            .send({ message: "Error soft-deleting insight" });
        }
        if (this.changes === 0) {
          return reply.code(404).send({ message: "Insight not found" });
        }
        return reply
          .code(200)
          .send({ message: "Insight soft-deleted successfully" });
      }
    );
  });
}
