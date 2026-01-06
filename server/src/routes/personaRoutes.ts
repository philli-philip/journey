import { Persona } from "@shared/types";
import { FastifyInstance } from "fastify";
import { CreatePersonaDto, UpdatePersonaDto } from "@shared/Dto/persona.types";
import db from "src/db/db";
import { buildFieldValueClause } from "src/utils/sql-helper";

export default async function personaRoutes(fastify: FastifyInstance) {
  fastify.get("/personas", (req, reply) => {
    try {
      const rows = db
        .prepare("SELECT * FROM personas WHERE deletedAt IS NULL")
        .all();
      reply.send(rows);
    } catch (err: any) {
      console.error("Error fetching personas:", err.message);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/personas/:slug", (req, reply) => {
    const { slug } = req.params as { slug: string };
    try {
      const row = db
        .prepare("SELECT * FROM personas WHERE slug = ? AND deletedAt IS NULL")
        .get(slug);
      if (!row) {
        reply.status(404).send({ error: "Persona not found" });
      } else {
        reply.send(row);
      }
    } catch (err: any) {
      console.error("Error fetching persona:", err.message);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.post("/personas", (req, reply) => {
    const { slug, name, description } = req.body as CreatePersonaDto;
    try {
      const row = db
        .prepare(
          "INSERT INTO personas (slug, name, description) VALUES (?, ?, ?) RETURNING *"
        )
        .get(slug, name, description);
      reply.send(row);
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed: personas.slug")) {
        reply
          .status(400)
          .send({ error: "Persona with this slug already exists" });
      } else {
        console.error("Error creating persona:", err.message);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  });

  fastify.delete("/personas/:slug", (req, reply) => {
    const { slug } = req.params as { slug: string };
    try {
      db.prepare(
        "UPDATE personas SET deletedAt = CURRENT_TIMESTAMP WHERE slug = ?"
      ).run(slug);
      reply.send({ message: "Persona deleted successfully", slug });
    } catch (err: any) {
      console.error("Error deleting persona:", err.message);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.put("/personas", (req, reply) => {
    const { slug, name, description } = req.body as UpdatePersonaDto;
    const { fields, values } = buildFieldValueClause({
      updates: { name, description },
      updatedAt: true,
    });

    try {
      const result = db
        .prepare(`UPDATE personas SET ${fields} WHERE slug = ?`)
        .run(...values, slug);
      if (result.changes === 0) {
        reply.status(404).send({ error: "Persona not found" });
      } else {
        reply.send({ message: "Persona updated successfully", slug });
      }
    } catch (err: any) {
      console.error("Error updating persona:", err.message);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
}
