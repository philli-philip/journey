import Fastify from "fastify";
import cors from "@fastify/cors";
import journeyRoutes from "./routes/journeyRoutes";
import stepRoutes from "./routes/stepRoutes";
import insightRoutes from "./routes/insightRoutes";
import imageRoutes from "./routes/imageRoutes";
import fastifySchedule from "@fastify/schedule";
import { ImageCleanUpCron } from "./controllers/ImageCleanUp";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: "http://localhost:3000", // Allow requests from your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow GET, POST, PUT, and DELETE requests
});

fastify.register(journeyRoutes);
fastify.register(stepRoutes);
fastify.register(insightRoutes);
fastify.register(imageRoutes);
fastify.register(fastifySchedule);

fastify.ready().then(() => {
  fastify.scheduler.addCronJob(ImageCleanUpCron);
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
