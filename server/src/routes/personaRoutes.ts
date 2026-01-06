import { FastifyInstance } from "fastify";
import { CreatePersonaDto, UpdatePersonaDto } from "@shared/Dto/persona.types";
import {
  createPersona,
  deletePersona,
  getPersona,
  getPersonas,
  updatePersona,
} from "src/controllers/personaController";

export default async function personaRoutes(fastify: FastifyInstance) {
  fastify.get("/personas", async (req, reply) => {
    const rows = await getPersonas();
    reply.send(rows);
  });

  fastify.get("/personas/:slug", async (req, reply) => {
    const { slug } = req.params as { slug: string };
    const persona = await getPersona(slug);
    reply.send(persona);
  });

  fastify.post("/personas", async (req, reply) => {
    const { slug, name, description } = req.body as CreatePersonaDto;
    const result = await createPersona({ slug, name, description });
    reply.send(result);
  });

  fastify.delete("/personas/:slug", (req, reply) => {
    const { slug } = req.params as { slug: string };
    const result = deletePersona(slug);
    reply.send(result);
  });

  fastify.put("/personas", (req, reply) => {
    const { slug, changes } = req.body as UpdatePersonaDto;
    const result = updatePersona({ slug, changes });
    reply.send(result);
  });
}
