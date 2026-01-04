import Fastify from "fastify";
import cors from "@fastify/cors";
import journeyRoutes from "./routes/journeyRoutes";
import stepRoutes from "./routes/stepRoutes";
import insightRoutes from "./routes/insightRoutes";
import imageRoutes from "./routes/imageRoutes";
import fastifySchedule from "@fastify/schedule";
import { ImageCleanUpCron } from "./controllers/ImageCleanUp";
import stepConnectionRoutes from "./routes/step_connectionRoutes";
import personaRoutes from "./routes/personaRoutes";
import { API_BASE_PORT, APP_URL } from "@shared/constants";

const fastify = Fastify({
  logger: true,
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
  try {
    console.log(`Attempting to listen on port ${API_BASE_PORT}`);
    await fastify.listen({ port: API_BASE_PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
