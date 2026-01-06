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

    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO images (id, imageData, originalImage, filename, mimeType, size, altText) VALUES (?, ?, ?, ?, ?, ?,?)",
        [
          imageId,
          processedImage,
          imageData,
          file.filename,
          finalMimeType,
          file.file.bytesRead,
          altText,
        ],
        function (err) {
          if (err) {
            console.error("Error inserting image:", err);
            reply.code(500).send({ message: "Error uploading image." });
            reject(err);
            return;
          }

          db.run(
            "UPDATE steps SET imageId = ? WHERE id = ?",
            [imageId, stepId],
            function (err) {
              if (err) {
                console.error("Error updating step with imageId:", err);
                reply.code(500).send({ message: "Error updating step." });
                reject(err);
                return;
              }

              db.get(
                "SELECT journeyId FROM steps WHERE id = ?",
                [stepId],
                (err, row: { journeyId: string }) => {
                  if (err) {
                    console.error("Error fetching journeyId:", err);
                    reply
                      .code(500)
                      .send({ message: "Error fetching journeyId." });
                    reject(err);
                    return;
                  }
                  if (!row) {
                    reply.code(404).send({ message: "Step not found." });
                    resolve(null);
                    return;
                  }
                  reply.code(200).send({
                    message: "Image uploaded and step updated successfully.",
                    imageId: imageId,
                    journeyId: row.journeyId,
                  });
                  resolve({
                    message: "Image uploaded and step updated successfully.",
                    imageId: imageId,
                    journeyId: row.journeyId,
                  });
                }
              );
            }
          );
        }
      );
    });
  });

  fastify.delete("/images/:imageId", async (request, reply) => {
    const { stepId, imageId } = request.params as {
      stepId: string;
      imageId: string;
    };

    return new Promise((resolve, reject) => {
      db.run("UPDATE steps SET imageId = NULL WHERE imageId= ?", [imageId]);
      db.run(
        "UPDATE images SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [imageId, stepId],
        function (err) {
          if (err) {
            reply.code(500).send({ message: "Error soft-deleting image" });
            reject(err);
          }
          if (this.changes === 0) {
            reply
              .code(404)
              .send({ message: "Image not found or already deleted" });
            resolve(null);
          }
          reply.code(200).send({ message: "Image soft-deleted successfully" });
          resolve({ message: "Image soft-deleted successfully" });
        }
      );
    });
  });

  fastify.get("/images/:imageId", async (request, reply) => {
    const { imageId } = request.params as { imageId: string };

    return new Promise((resolve, reject) => {
      db.get(
        "SELECT imageData, mimeType, filename FROM images WHERE id = ? AND deletedAt IS NULL",
        [imageId],
        (
          err,
          row: { imageData: Buffer; mimeType: string; filename: string }
        ) => {
          if (err) {
            console.error("Error fetching image:", err);
            reply.code(500).send({ message: "Error fetching image." });
            reject(err);
            return;
          }
          if (!row) {
            reply.code(404).send({ message: "Image not found." });
            resolve(null);
            return;
          }

          reply.header("Content-Type", row.mimeType);
          reply.header(
            "Content-Disposition",
            `inline; filename="${row.filename}"`
          );
          reply.send(row.imageData);
          resolve(row.imageData);
        }
      );
    });
  });
}
