import sharp from "sharp";
import { randomID } from "@shared/randomID";
import db from "../db/db";

export interface ProcessedImageResult {
  processedImage: Buffer;
  originalImage: Buffer;
  mimeType: string;
}

export interface ImageUploadResult {
  imageId: string;
  journeyId: string;
}

export interface ImageData {
  imageData: Buffer;
  mimeType: string;
  filename: string;
}

export async function processImage(
  imageBuffer: Buffer
): Promise<ProcessedImageResult> {
  const processedImage = await sharp(imageBuffer)
    .resize(1600, 1600, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .jpeg({ quality: 85 })
    .toBuffer();

  return {
    processedImage,
    originalImage: imageBuffer,
    mimeType: "image/jpeg",
  };
}

export async function insertImage(
  processedImage: Buffer,
  originalImage: Buffer,
  filename: string,
  mimeType: string,
  size: number,
  altText?: string
): Promise<string> {
  const imageId = randomID();

  db.prepare(
    "INSERT INTO images (id, imageData, originalImage, filename, mimeType, size, altText) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    imageId,
    processedImage,
    originalImage,
    filename,
    mimeType,
    size,
    altText
  );
  return imageId;
}

export async function linkImageToStep(
  imageId: string,
  stepId: string
): Promise<string> {
  db.prepare("UPDATE steps SET imageId = ? WHERE id = ?").run(imageId, stepId);
  const row = db
    .prepare("SELECT journeyId FROM steps WHERE id = ?")
    .get(stepId) as { journeyId: string } | undefined;

  if (!row) {
    throw new Error("Step not found");
  }
  return row.journeyId;
}

export async function ImageForStep(
  imageBuffer: Buffer,
  filename: string,
  fileSize: number,
  stepId: string,
  altTag?: string
): Promise<ImageUploadResult> {
  const { processedImage, originalImage, mimeType } = await processImage(
    imageBuffer
  );

  let imageId = "";
  let journeyId = "";

  const transaction = db.transaction(() => {
    imageId = randomID();
    db.prepare(
      "INSERT INTO images (id, imageData, originalImage, filename, mimeType, size, altText) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(
      imageId,
      processedImage,
      originalImage,
      filename,
      mimeType,
      fileSize,
      altTag
    );

    db.prepare("UPDATE steps SET imageId = ? WHERE id = ?").run(
      imageId,
      stepId
    );

    const row = db
      .prepare("SELECT journeyId FROM steps WHERE id = ?")
      .get(stepId) as { journeyId: string } | undefined;

    if (!row) {
      throw new Error("Step not found");
    }
    journeyId = row.journeyId;
  });

  transaction();

  return { imageId, journeyId };
}

export async function deleteImage(imageId: string): Promise<number> {
  const transaction = db.transaction(() => {
    db.prepare("UPDATE steps SET imageId = NULL WHERE imageId = ?").run(
      imageId
    );
    const info = db
      .prepare("UPDATE images SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?")
      .run(imageId);
    return info.changes;
  });

  return transaction();
}

export async function getImage(imageId: string): Promise<ImageData | null> {
  const row = db
    .prepare(
      "SELECT imageData, mimeType, filename FROM images WHERE id = ? AND deletedAt IS NULL"
    )
    .get(imageId) as ImageData | undefined;

  return row || null;
}
