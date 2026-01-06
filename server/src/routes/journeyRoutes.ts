import { FastifyInstance } from "fastify";
import db from "../db/db";
import { randomID } from "@shared/randomID";
import type {
  createJourneyDto,
  updateJourneyDto,
} from "@shared/Dto/journey.types";
import {
  createJourney,
  deleteJourney,
  getJourneyList,
  restoreJourney,
  updateJourney,
} from "src/controllers/journeyController";

export default async function journeyRoutes(fastify: FastifyInstance) {
  fastify.get("/journeys", async (request, reply) => {
    const { personaSlug } = request.query as { personaSlug?: string };

    const items = await getJourneyList({ personaSlug });
    return items;
  });

  fastify.post("/journeys", async (request, reply) => {
    const { personaSlugs, name, description, orderedStepIds } =
      request.body as createJourneyDto;

    const item = await createJourney({
      name,
      description,
      orderedStepIds,
      personaSlugs,
    });
    return item;
  });

  fastify.get("/journeys/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const row = db
        .prepare(
          `SELECT
          uj.id AS id,
          uj.name AS name,
          uj.description AS description,
          uj.createdAt AS createdAt,
          uj.updatedAt AS updatedAt,
          uj.deletedAt AS deletedAt,
          uj.orderedStepIds AS orderedStepIds,
          (SELECT json_group_array(json_object('slug', p.slug, 'name', p.name)) FROM json_each(uj.personaSlugs) AS je JOIN personas p ON p.slug = je.value AND p.deletedAt IS NULL) AS personas,
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
          uj.id = ?`
        )
        .get(id) as { personas: string; steps: string } | undefined;

      if (!row) {
        return reply.code(404).send({ message: "Journey not found" });
      }

      // Parse JSON strings into objects
      if (row.personas) {
        row.personas = JSON.parse(row.personas);
      }
      if (row.steps) {
        row.steps = JSON.parse(row.steps);
      }
      return reply.code(200).send(row);
    } catch (err: any) {
      reply.code(500).send({ message: "Error fetching journey" });
      throw err;
    }
  });

  fastify.put("/journeys/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as updateJourneyDto["updates"];

    const update = await updateJourney({ id, updates });
    return update;
  });

  fastify.delete("/journeys/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = deleteJourney(id);
    return result;
  });

  fastify.put("/journeys/:id/restore", async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await restoreJourney(id);
    reply.send(item);
  });
}
