/**
 * Builds a SQL clause for updating fields and values. It skips undefined values automatically so that they are not updated.
 *
 * @param updates Array of key-value pairs to update.
 * @param updatedAt Whether to include column and value to update updatedAt timestamp. Defaults to false.
 * @returns Object with fields and values for the SQL clause.
 */
export function buildFieldValueClause({
  updates,
  updatedAt = false,
}: {
  updates: Record<string, string | number | undefined | string[]>;
  updatedAt?: boolean;
}) {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      if (Array.isArray(value)) {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
    }
  }

  if (updatedAt) {
    fields.push("updatedAt = CURRENT_TIMESTAMP");
  }

  const mergedFields = fields.join(", ");
  return { fields: mergedFields, values };
}
