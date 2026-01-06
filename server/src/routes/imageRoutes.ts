import { FastifyInstance } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import { randomID } from "@shared/randomID";
import db from "../db/db";
import multipart from "@fastify/multipart";
import { Multipart } from "@fastify/multipart";
import sharp from "sharp";

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
    let altText: string | undefined;
    let imageData: Buffer | undefined;
    let finalMimeType = "image/jpeg";
    let processedImage: Buffer | undefined;

    try {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === "file") {
          file = part;
          imageData = await file.toBuffer(); // Consume the file stream here

          processedImage = await sharp(imageData)
            .resize(1600, 1600, {
              withoutEnlargement: true, // Don't upscale smaller images
              fit: "inside", // Maintain aspect ratio
            })
            .jpeg({ quality: 85 }) // Convert to JPEG with good quality
            .toBuffer();
          finalMimeType = "image/jpeg";
        } else {
          if (part.fieldname === "stepId") {
            stepId = part.value as string;
          } else if (part.fieldname === "altText") {
            altText = part.value as string;
          }
        }
      }
    } catch (parseError) {
      console.error("Error parsing multipart request:", parseError);
      reply.code(500).send({ message: "Error parsing multipart request." });
      return;
    }

    if (!file || !imageData) {
      reply.code(400).send({ message: "No image file provided." });
      return;
    }

    if (!stepId) {
      reply.code(400).send({ message: "stepId is required." });
      return;
    }

    const imageId = randomID();

    try {
      const transaction = db.transaction(() => {
        db.prepare(
          "INSERT INTO images (id, imageData, originalImage, filename, mimeType, size, altText) VALUES (?, ?, ?, ?, ?, ?,?)"
        ).run(
          imageId,
          processedImage,
          imageData,
          file!.filename,
          finalMimeType,
          file!.file.bytesRead,
          altText
        );

        db.prepare("UPDATE steps SET imageId = ? WHERE id = ?").run(
          imageId,
          stepId
        );
      });

      transaction();

      const row = db
        .prepare("SELECT journeyId FROM steps WHERE id = ?")
        .get(stepId) as { journeyId: string } | undefined;

      if (!row) {
        return reply.code(404).send({ message: "Step not found." });
      }

      const response = {
        message: "Image uploaded and step updated successfully.",
        imageId: imageId,
        journeyId: row.journeyId,
      };
      reply.code(200).send(response);
      return response;
    } catch (err: any) {
      console.error("Error uploading image:", err);
      reply.code(500).send({ message: "Error uploading image." });
    }
  });

  fastify.delete("/images/:imageId", async (request, reply) => {
    const { imageId } = request.params as {
      imageId: string;
    };

    try {
      const transaction = db.transaction(() => {
        db.prepare("UPDATE steps SET imageId = NULL WHERE imageId= ?").run(
          imageId
        );
        return db
          .prepare(
            "UPDATE images SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?"
          )
          .run(imageId);
      });

      const result = transaction();

      if (result.changes === 0) {
        return reply
          .code(404)
          .send({ message: "Image not found or already deleted" });
      }

      const response = { message: "Image soft-deleted successfully" };
      reply.code(200).send(response);
      return response;
    } catch (err: any) {
      console.error("Error deleting image:", err);
      reply.code(500).send({ message: "Error soft-deleting image" });
    }
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
