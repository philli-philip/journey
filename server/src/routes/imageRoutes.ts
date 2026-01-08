import { FastifyInstance } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import db from "../db/db";
import multipart from "@fastify/multipart";
import { Multipart } from "@fastify/multipart";
import {
  deleteImage,
  insertImage,
  processImage,
} from "src/controllers/imageController";
import { updatePersona } from "src/controllers/personaController";
import { updateStep } from "src/controllers/stepController";

declare module "fastify" {
  interface FastifyRequest {
    parts: () => AsyncIterableIterator<Multipart>;
    file: () => Promise<MultipartFile>;
    isMultipart: () => boolean;
  }
}

export default async function imageRoutes(fastify: FastifyInstance) {
  fastify.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024, // Set file size limit to 20MB
    },
  });

  fastify.post("/images", async (request, reply) => {
    let file: MultipartFile | undefined;
    let stepId: string | undefined;
    let personaSlug: string | undefined;
    let altText: string | undefined;
    let imageData: Buffer | undefined;
    let finalMimeType = "image/jpeg";

    const parts = request.parts();
    for await (const part of parts) {
      if (part.type === "file") {
        file = part;
        imageData = await file.toBuffer();
      } else {
        if (part.fieldname === "stepId") {
          stepId = part.value as string;
        }
        if (part.fieldname === "personaSlug") {
          personaSlug = part.value as string;
        }
      }
    }

    if (!file || !imageData) {
      reply.code(400).send({ message: "No image file provided." });
      return;
    }

    if (!stepId && !personaSlug) {
      reply.code(400).send({ message: "stepId is required." });
      return;
    }

    const { processedImage } = await processImage(imageData);
    const imageId = await insertImage(
      processedImage,
      imageData,
      file!.filename,
      finalMimeType,
      file!.file.bytesRead,
      altText
    );

    console.log("Image id", imageId);
    if (stepId) {
      const step = await updateStep({ id: stepId, changes: { imageId } });

      reply.send({
        message: "Image uploaded and step updated successfully.",
        imageId: imageId,
        journeyId: step.journeyId,
      });
    } else if (personaSlug) {
      const item = await updatePersona({
        slug: personaSlug,
        changes: { imageId },
      });

      reply.send({
        message: "Image uploaded and persona updated.",
        imageId: imageId,
        personaSlug: item.slug,
      });
    } else {
      reply.send({
        message: "Image uploaded",
        imageId,
      });
    }
  });

  fastify.delete("/images/:imageId", async (request, reply) => {
    const { imageId } = request.params as {
      imageId: string;
    };

    const transaction = db.transaction(() => {
      db.prepare(
        "UPDATE steps SET imageId = NULL WHERE imageId= ? RETURNING *"
      ).get(imageId);
      deleteImage(imageId);
    });
    transaction();

    return reply.code(200).send({ message: "Image soft-deleted successfully" });
  });

  fastify.get("/images/:imageId", async (request, reply) => {
    const { imageId } = request.params as { imageId: string };

    try {
      const row = db
        .prepare(
          "SELECT imageData, mimeType, filename FROM images WHERE id = ? AND deletedAt IS NULL"
        )
        .get(imageId) as
        | { imageData: Buffer; mimeType: string; filename: string }
        | undefined;

      if (!row) {
        return reply.code(404).send({ message: "Image not found." });
      }

      reply.header("Content-Type", row.mimeType);
      reply.header("Content-Disposition", `inline; filename="${row.filename}"`);
      reply.send(row.imageData);
      return row.imageData;
    } catch (err: any) {
      console.error("Error fetching image:", err);
      reply.code(500).send({ message: "Error fetching image." });
    }
  });
}
