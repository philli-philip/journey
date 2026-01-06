import Fastify from "fastify";
import cors from "@fastify/cors";
import journeyRoutes from "./routes/journeyRoutes";
import stepRoutes from "./routes/stepRoutes";
import insightRoutes from "./routes/insightRoutes";
import imageRoutes from "./routes/imageRoutes";
import fastifySchedule from "@fastify/schedule";
import { ImageCleanUpCron } from "./cron/ImageCleanUp";
import stepConnectionRoutes from "./routes/step_connectionRoutes";
import personaRoutes from "./routes/personaRoutes";
import { API_BASE_PORT, APP_URL } from "@shared/constants";
import { Migrator } from "./db/migrator";
import path from "path";
import { fileURLToPath } from "url";
import { AppError } from "./utils/errors";

const fastify = Fastify({
  logger: true,
});

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message });
  }

  // Fallback for other errors
  fastify.log.error(error);
  reply.status(500).send({ error: "Internal server error" });
});

fastify.register(cors, {
  origin: APP_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

fastify.register(journeyRoutes);
fastify.register(stepRoutes);
fastify.register(insightRoutes);
fastify.register(imageRoutes);
fastify.register(fastifySchedule);
fastify.register(stepConnectionRoutes);
fastify.register(personaRoutes);

fastify.ready().then(() => {
  fastify.scheduler.addCronJob(ImageCleanUpCron);
});

const start = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const migrator = new Migrator(path.join(__dirname, "/db/migrations"));
  await migrator.runMigrations();

  try {
    console.log(`Attempting to listen on port ${API_BASE_PORT}`);
    await fastify.listen({ port: API_BASE_PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
