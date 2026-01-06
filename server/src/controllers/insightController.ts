import { createInsightDto, updateInsightDto } from "@shared/Dto/insight.types";
import { randomID } from "@shared/randomID";
import { Insight, InsightTypes } from "@shared/types";
import db from "src/db/db";
import { AppError } from "src/utils/errors";
import { buildFieldValueClause } from "src/utils/sql-helper";

export async function createInsight(insight: createInsightDto) {
  try {
    const id = randomID();
    const result = await db
      .prepare(
        "INSERT INTO insights (id, title, description, type, createdAt, updatedAt) VALUES(?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) RETURNING *"
      )
      .get(id, insight.title, insight.description || "", insight.type);
    return result as Insight;
  } catch (err) {
    throw err;
  }
}

export async function deleteInsight(id: string) {
  try {
    const item = (await db
      .prepare(
        "UPDATE insights SET deletedAT = CURRENT_TIMESTAMP WHERE id = ? RETURNING *"
      )
      .get(id)) as Insight;
    return item;
  } catch (err) {
    throw err;
  }
}

export async function updateInsight({ id, updates }: updateInsightDto) {
  console.log("Updte: ", id, updates);
  try {
    const { fields, values } = buildFieldValueClause({
      updates,
      updatedAt: true,
    });

    const item = (await db
      .prepare(`UPDATE insights SET ${fields} WHERE id = ? RETURNING *`)
      .get(...values, id)) as Insight;
    return item;
  } catch (err) {
    return err;
  }
}

export async function getInsight(id: string) {
  try {
    const item = await db
      .prepare("SELECT * FROM insights WHERE id = ? AND deletedAt IS NULL")
      .get(id);
    return item as Insight;
  } catch (err) {
    return new AppError(500, "Server error while getting insight");
  }
}

export async function getInsightList(filter?: { type?: InsightTypes }) {
  if (!filter) {
    const items = db
      .prepare("SELECT * FROM insights WHERE deletedAt is NULL")
      .all() as Insight[];
    return items;
  } else {
    const items = db
      .prepare("SELECT * FROM insights WHERE deletedAt is NULL AND type = ?")
      .all(filter.type);
    return items;
  }
}
