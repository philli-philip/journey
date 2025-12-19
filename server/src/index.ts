import db from "./db";
import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: false,
});

fastify.register(cors, {
  origin: "http://localhost:3000", // Allow requests from your frontend origin
  methods: ["GET", "PUT", "DELETE"], // Allow GET, PUT, and DELETE requests
});

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
        resolve(rows);
      }
    );
  });
});

fastify.get("/journeys/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM user_journeys WHERE id = ?", [id], (err, row) => {
      if (err) {
        reply.code(500).send({ message: "Error fetching journey" });
        reject(err);
      }
      if (!row) {
        reply.code(404).send({ message: "Journey not found" });
        resolve(null);
      }
      resolve(row);
    });
  });
});

fastify.put("/journeys/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const { name, description } = request.body as {
    name?: string;
    description?: string;
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

  if (fields.length === 0) {
    reply.code(400).send({ message: "No fields provided to update" });
    return;
  }

  fields.push("updatedAt = CURRENT_TIMESTAMP");
  values.push(id);

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE user_journeys SET ${fields.join(", ")} WHERE id = ?`,
      values,
      function (err) {
        if (err) {
          reply.code(500).send({ message: "Error updating journey" });
          reject(err);
        }
        if (this.changes === 0) {
          reply.code(404).send({ message: "Journey not found" });
          resolve(null);
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
        reply.code(200).send({ message: "Journey soft-deleted successfully" });
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

const start = async () => {
  try {
    console.log("Attempting to listen on port 3001");
    await fastify.listen({ port: 3001 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
