import { Migration } from "../migrator";

export const migration: Migration = {
  id: 2,
  name: "Add image to persona",
  up: (db) => {
    db.exec(
      "ALTER TABLE personas ADD COLUMN imageId TEXT REFERENCES images(id)"
    );
  },
  down: (db) => {
    db.exec("ALTER TABLE personas DROP COLUMN imageId");
  },
};
