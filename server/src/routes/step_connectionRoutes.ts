import { randomID } from "@shared/randomID";
import { FastifyInstance } from "fastify";
import db from "src/db/db";

export default async function stepConnectionRoutes(app: FastifyInstance) {
  app.get("/connections", (req, res) => {
    db.all("SELECT * FROM step_connections", (err, stepConnections) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(stepConnections);
      }
    });
  });

  app.post("/connections", (req, res) => {
    const id = randomID();
    const { stepId, type, attributeId } = req.body as {
      stepId: string;
      type: string;
      attributeId: string;
    };
    db.run(
      "INSERT INTO step_connections (id, stepId, attributeType, attributeID) VALUES (?,?, ?, ?)",
      [id, stepId, "insight", attributeId],
      (err) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.send({ id, stepId, type, attributeId });
        }
      }
    );
  });
}
