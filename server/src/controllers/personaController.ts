import { CreatePersonaDto, UpdatePersonaDto } from "@shared/Dto/persona.types";
import { Persona } from "@shared/types";
import db from "src/db/db";
import { AppError, ConflictError } from "src/utils/errors";
import { buildFieldValueClause } from "src/utils/sql-helper";

export async function createPersona(persona: CreatePersonaDto) {
  try {
    const result = db
      .prepare(
        "INSERT INTO personas (name, slug, description) VALUES (?, ?, ?) RETURNING *"
      )
      .get(persona.name, persona.slug, persona.description || "");

    return result;
  } catch (err: any) {
    if (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
      throw new ConflictError(
        `Persona with slug '${persona.slug}' already exists`
      );
    }
    throw err;
  }
}

export async function deletePersona(slug: string) {
  try {
    const result = db
      .prepare(
        "UPDATE personas SET deletedAT = CURRENT_TIMESTAMP WHERE slug = ? RETURNING *"
      )
      .get(slug);

    return result as Persona;
  } catch (err) {
    throw err;
  }
}

export async function getPersonas() {
  const result = db
    .prepare("SELECT * FROM personas WHERE deletedAT IS NULL")
    .all();
  return result as Persona[];
}

export async function getPersona(slug: string) {
  const result = db
    .prepare("SELECT * FROM personas WHERE slug = ? AND deletedAT IS NULL")
    .get(slug);
  if (!result) {
    throw new AppError(404, `Persona with slug '${slug}' not found`);
  }
  return result as Persona;
}

export async function updatePersona(updates: UpdatePersonaDto) {
  const { slug, changes } = updates;
  const { fields, values } = buildFieldValueClause({
    updates: changes,
    updatedAt: true,
  });
  const result = db
    .prepare(`UPDATE personas SET ${fields} WHERE slug = ? RETURNING *`)
    .get(...values, slug);

  return result as Persona;
}
