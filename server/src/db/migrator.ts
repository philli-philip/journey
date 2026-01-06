import db from "./db";
import fs from "fs";
import path from "path";
import { Database } from "better-sqlite3";

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

  private getAppliedMigrations(): Set<number> {
    const rows = db.prepare("SELECT id FROM migrations").all() as {
      id: number;
    }[];
    return new Set(rows.map((row) => row.id));
  }

  private async loadMigrations(): Promise<Migration[]> {
    const files = fs
      .readdirSync(this.migrationsPath)
      .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
      .sort();

    const migrations: Migration[] = [];
    for (const file of files) {
      const migrationModule = await import(
        path.join(this.migrationsPath, file)
      );
      migrations.push(migrationModule.migration);
    }

    return migrations;
  }

  async runMigrations() {
    const appliedMigrations = this.getAppliedMigrations();
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

      const transaction = db.transaction(() => {
        migration.up(db);
        db.prepare("INSERT INTO migrations (id, name) VALUES (?, ?)").run(
          migration.id,
          migration.name
        );
      });

      try {
        transaction();
        console.log(`✓ Migration ${migration.id} completed`);
      } catch (err) {
        console.error(`Error running migration ${migration.id}:`, err);
        throw err;
      }
    }
  }

  async rollback() {
    const appliedMigrations = this.getAppliedMigrations();
    const migrations = await this.loadMigrations();

    const lastApplied = Math.max(...Array.from(appliedMigrations));
    const migration = migrations.find((m) => m.id === lastApplied);

    if (!migration) {
      console.log("No migrations to rollback");
      return;
    }

    console.log(`Rolling back migration ${migration.id}: ${migration.name}`);

    const transaction = db.transaction(() => {
      migration.down(db);
      db.prepare("DELETE FROM migrations WHERE id = ?").run(migration.id);
    });

    try {
      transaction();
      console.log(`✓ Rollback completed`);
    } catch (err) {
      console.error(`Error rolling back migration ${migration.id}:`, err);
      throw err;
    }
  }
}
