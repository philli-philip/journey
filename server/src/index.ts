import Fastify from "fastify";
import cors from "@fastify/cors";
import { mockUserJourneys } from "./mockdata/mockJourneys";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: "http://localhost:5175", // Allow requests from your frontend origin
  methods: ["GET"], // Allow only GET requests
});

fastify.get("/journeys", async (request, reply) => {
  return mockUserJourneys;
});

fastify.get("/journeys/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const journey = mockUserJourneys.find((j) => j.id === id);
  if (!journey) {
    reply.code(404).send({ message: "Journey not found" });
  }
  return journey;
});

const start = async () => {
  try {
    console.log("Attempting to listen on port 3000");
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
