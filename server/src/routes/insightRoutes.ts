import { FastifyInstance } from "fastify";
import db from "../db/db";
import {
  createInsight,
  deleteInsight,
  getInsight,
  getInsightList,
  updateInsight,
} from "src/controllers/insightController";
import { createInsightDto, updateInsightDto } from "@shared/Dto/insight.types";
import { InsightTypes, insightTypes } from "@shared/types";
import { AppError } from "src/utils/errors";

export default async function insightRoutes(fastify: FastifyInstance) {
  fastify.get("/insights", async (request, reply) => {
    const { type } = request.query as { type?: InsightTypes };
    if (type && !insightTypes.includes(type as any)) {
      return new AppError(400, `Cannot filter insights by type ${type}.`);
    }
    const insights = await getInsightList({ type });
    reply.send(insights);
  });

  fastify.get("/insights/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await getInsight(id);
    reply.send(item);
  });

  fastify.post("/insights", async (request, reply) => {
    const { title, description, type } = request.body as createInsightDto;
    const item = await createInsight({ title, description, type });
    reply.send(item);
  });

  fastify.put("/insights/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as updateInsightDto["updates"];

    const item = await updateInsight({
      id,
      updates,
    });
    reply.send(item);
  });

  fastify.delete("/insights/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await deleteInsight(id);
    reply.send(item);
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
      return reply
        .code(500)
        .send({ error: "Error fetching insights for step" });
    }
  });
}
