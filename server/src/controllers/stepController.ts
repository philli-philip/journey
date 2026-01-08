import { updateStepDto } from "@shared/Dto/step.types";
import { randomID } from "@shared/randomID";
import { Step } from "@shared/types";
import db from "src/db/db";
import { buildFieldValueClause } from "src/utils/sql-helper";

export async function createStep(journeyID: string) {
  const id = randomID();
  const step = await db
    .prepare("INSERT INTO steps (id, journeyId, name) VALUES(?,?,'New step')")
    .get(id, journeyID);
  return step as Step;
}

export async function getStep(stepID: string) {
  return (await db
    .prepare("SELECT * FROM steps WHERE deletedAT is NULL")
    .get(stepID)) as Step;
}

export async function updateStep({ id, changes }: updateStepDto) {
  const { fields, values } = buildFieldValueClause({
    updates: changes,
    updatedAt: true,
  });
  const item = await db
    .prepare(`UPDATE steps ${fields} where id = ? RETURINING *`)
    .get(values, id);
  return item as Step;
}

export async function deleteStep(id: string) {
  const item = (await db
    .prepare(
      "UPDATE steps SET deletedAt = CURRENT_TIMESTAMP where id = ? RETURNING *"
    )
    .get(id)) as Step;

  return item;
}
