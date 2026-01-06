import { Migration } from "../migrator";

export const migration: Migration = {
  id: 2,
  name: "Add image to persona",
  up: (db) => {
    db.exec(
      "ALTER TABLE personas ADD COLUMN imageid TEXT REFERENCES images(id)"
    );
  },
  down: (db) => {
    db.exec("ALTER TABLE personas DROP COLUMN imageid");
  },
};
