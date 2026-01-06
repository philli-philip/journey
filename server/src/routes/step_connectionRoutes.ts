import { randomID } from "@shared/randomID";
import { FastifyInstance } from "fastify";
import db from "src/db/db";

export default async function stepConnectionRoutes(app: FastifyInstance) {
  app.get("/connections", (req, res) => {
    try {
      const stepConnections = db
        .prepare("SELECT * FROM step_connections")
        .all();
      res.send(stepConnections);
    } catch (err: any) {
      res.status(500).send({ error: err.message });
    }
  });

  app.post("/connections", (req, res) => {
    const id = randomID();
    const { stepId, type, attributeId } = req.body as {
      stepId: string;
      type: string;
      attributeId: string;
    };
    try {
      db.prepare(
        "INSERT INTO step_connections (id, stepId, attributeType, attributeID) VALUES (?,?, ?, ?)"
      ).run(id, stepId, "insight", attributeId);
      res.send({ id, stepId, type, attributeId });
    } catch (err: any) {
      res.status(500).send({ error: err.message });
    }
  });
}
