import db from "./db";
import fs from "fs";
import path from "path";
import { Database } from "sqlite3";

export interface Migration {
  id: number;
  name: string;
  up: (db: Database) => void;
  down: (db: Database) => void;
}

export class Migrator {
  private migrationsPath: string;

  constructor(migrationsPath: string) {
    this.migrationsPath = migrationsPath;
    this.ensureMigrationsTable();
  }

  private ensureMigrationsTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private getAppliedMigrations() {
    return new Promise<Set<number>>((resolve, reject) => {
      db.all(
        "SELECT id FROM migrations",
        function (err, rows: { id: number }[]) {
          if (err) {
            reject(err);
          }
          resolve(new Set(rows.map((row) => row.id)));
        }
      );
    });
  }

  private async loadMigrations(): Promise<Migration[]> {
    const files = fs
      .readdirSync(this.migrationsPath)
      .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
      .sort();

    const migrations: Migration[] = [];
    for (const file of files) {
      const migration = await import(path.join(this.migrationsPath, file));

      migrations.push(migration.migration);
    }

    return migrations;
  }

  async runMigrations() {
    const appliedMigrations = await this.getAppliedMigrations();
    const migrations = await this.loadMigrations();

    console.log(`Loaded ${migrations.length} migrations`);

    const pendingMigrations = migrations.filter(
      (m) => !appliedMigrations.has(m.id)
    );

    if (pendingMigrations.length === 0) {
      console.log("No pending migrations");
      return;
    }

    for (const migration of pendingMigrations) {
      console.log(`Running migration ${migration.id}: ${migration.name}`);

      db.exec("BEGIN TRANSACTION");
      try {
        migration.up(db);
        db.prepare("INSERT INTO migrations (id, name) VALUES (?, ?)").run(
          migration.id,
          migration.name
        );
        db.exec("COMMIT");
      } catch (err) {
        db.exec("ROLLBACK");
        throw err;
      }

      console.log(`✓ Migration ${migration.id} completed`);
    }
  }

  async rollback() {
    const appliedMigrations = this.getAppliedMigrations();
    const migrations = await this.loadMigrations();

    const lastApplied = Math.max(...(await appliedMigrations));
    const migration = migrations.find((m) => m.id === lastApplied);

    if (!migration) {
      console.log("No migrations to rollback");
      return;
    }

    console.log(`Rolling back migration ${migration.id}: ${migration.name}`);

    db.run("DELETE FROM migrations WHERE id = ?", migration.id);

    console.log(`✓ Rollback completed`);
  }
}
