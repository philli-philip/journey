import { Persona } from "@shared/types";
import { FastifyInstance } from "fastify";
import { CreatePersonaDto, UpdatePersonaDto } from "@shared/Dto/persona.types";
import db from "src/db";
import { buildFieldValueClause } from "src/utils/sql-helper";

export default async function personaRoutes(fastify: FastifyInstance) {
  fastify.get("/personas", (req, reply) => {
    db.all(
      "SELECT * FROM personas WHERE deletedAt IS NULL",
      function (err, rows) {
        if (err) {
          console.error("Error fetching personas:", err.message);
          return reply.status(500).send({ error: "Internal server error" });
        } else {
          reply.send(rows);
          return;
        }
      }
    );
  });

  fastify.get("/personas/:slug", (req, reply) => {
    const { slug } = req.params as { slug: string };
    db.get(
      "SELECT * FROM personas WHERE slug = ? AND deletedAt IS NULL",
      [slug],
      function (err, row) {
        if (err) {
          console.error("Error fetching persona:", err.message);
          reply.status(500).send({ error: "Internal server error" });
        } else if (!row) {
          reply.status(404).send({ error: "Persona not found" });
        } else {
          reply.send(row);
        }
      }
    );
  });

  fastify.post("/personas", (req, reply) => {
    const { slug, name, description } = req.body as CreatePersonaDto;
    db.run(
      "INSERT INTO personas (slug, name, description) VALUES (?, ?, ?) RETURNING *",
      [slug, name, description],
      function (err: Error, row: Persona) {
        if (err) {
          if (
            err.message ===
            "SQLITE_CONSTRAINT: UNIQUE constraint failed: personas.slug"
          ) {
            reply
              .status(400)
              .send({ error: "Persona with this slug already exists" });
          }
          console.error("Error creating persona:", err.message);
          reply.status(500).send({ error: "Internal server error" });
        } else {
          reply.send(row);
        }
      }
    );
  });

  fastify.delete("/personas/:slug", (req, reply) => {
    const { slug } = req.params as { slug: string };
    db.run(
      "UPDATE personas SET deletedAt = CURRENT_TIMESTAMP WHERE slug = ?",
      [slug],
      function (err) {
        if (err) {
          reply.status(500).send({ error: "Internal server error" });
        } else {
          reply.send({ message: "Persona deleted successfully", slug });
        }
      }
    );
  });

  fastify.put("/personas", (req, reply) => {
    const { slug, name, description } = req.body as UpdatePersonaDto;
    const { fields, values } = buildFieldValueClause({
      updates: { name, description },
      updatedAt: true,
    });

    db.run(
      `UPDATE personas SET ${fields} WHERE slug = ?`,
      [...values, slug],
      function (this, err) {
        if (err) {
          reply.status(500).send({ error: "Internal server error:", err });
        } else if (this.changes === 0) {
          reply.status(404).send({ error: "Persona not found" });
        } else {
          reply.send({ message: "Persona updated successfully", slug });
        }
      }
    );
  });
}
