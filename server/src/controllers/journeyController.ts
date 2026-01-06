import db from "src/db/db";
import { buildFieldValueClause } from "src/utils/sql-helper";
import { createJourneyDto, updateJourneyDto } from "@shared/Dto/journey.types";
import { UserJourney } from "@shared/types";
import { randomID } from "@shared/randomID";

export async function removeStepFromJourney(
  journyedId: string,
  stepId: string
) {
  const row = (await db
    .prepare("SELECT orderedStepIds from user_journeys where id = ?")
    .get(journyedId)) as { orderedStepIds: string };
  const steps = JSON.parse(row.orderedStepIds) as string[];
  const newSteps = steps.filter((step) => step != stepId);
  console.log("new steps", newSteps);

  const item = await db
    .prepare(
      "UPDATE user_journeys SET orderedStepIds = ? WHERE id = ? RETURNING *"
    )
    .get(JSON.stringify(newSteps), journyedId);
  console.log("items", item);
}

export async function getJourneyList(filter: { personaSlug?: string }) {
  const items = (await db
    .prepare(
      `SELECT * from user_journeys WHERE deletedAt is NULL ${
        filter.personaSlug ? "AND personaSlugs LIKE ?" : ""
      }`
    )
    .all(
      filter.personaSlug ? [`%${filter.personaSlug}%`] : []
    )) as UserJourney[];

  return items;
}

export async function updateJourney({ id, updates }: updateJourneyDto) {
  const { fields, values } = buildFieldValueClause({
    updates,
    updatedAt: true,
  });

  const result = (await db
    .prepare(
      `UPDATE user_journeys SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ? RETURNING *`
    )
    .get(...values, id)) as UserJourney;
  return result;
}

export async function deleteJourney(id: string) {
  const item = (await db
    .prepare(
      "UPDATE user_journeys SET deletedAt = CURRENT_TIMESTAMP where id = ? RETURNING *"
    )
    .get(id)) as UserJourney;
  return item;
}

export async function restoreJourney(id: string) {
  const item = (await db
    .prepare(
      "UPDAET user_journey SET deletedAt = null, updatedAt = CURRENT_TIMESTAMP where id = ?"
    )
    .get(id)) as UserJourney;
  return item;
}

export async function createJourney({
  orderedStepIds,
  name,
  description,
  personaSlugs,
}: createJourneyDto) {
  const id = randomID();

  let finalPersonaSlugs: string[] = [];
  if (personaSlugs && Array.isArray(personaSlugs)) {
    finalPersonaSlugs = personaSlugs;
  } else if (typeof personaSlugs === "string") {
    finalPersonaSlugs.push(personaSlugs);
  }
  const stringedPersonaSlugs = JSON.stringify(finalPersonaSlugs);

  const item = (await db
    .prepare(
      "INSERT INTO user_journeys (id, name, description, orderedStepIds, personaSlugs) VALUES(?,?, ?, ?, ?) RETURNING *"
    )
    .get(
      id,
      name || "New journey",
      description,
      orderedStepIds,
      stringedPersonaSlugs
    )) as UserJourney;

  return item;
}
