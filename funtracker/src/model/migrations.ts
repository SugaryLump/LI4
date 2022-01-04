// Este módulo gere as migrations, ou seja, alterações à base de dados

import { readdir, readFile } from "fs/promises";
import path from "path";
import { PromisedDatabase } from "promised-sqlite3";

const migrationsDir = './src/migrations/'

async function createMigrationsTable(db: PromisedDatabase) {
    await db.run(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) UNIQUE
        );
    `)
}

async function isMigrationDone(db: PromisedDatabase, migration: string): Promise<boolean> {
    return await db.get("SELECT 1 FROM migrations WHERE name = ?;", migration) !== undefined
}

export default async function migrate(db: PromisedDatabase) {
    // 1. Listar ficheiros de migrations 
    let results = await readdir(migrationsDir)
    let migrations = results.sort()

    await createMigrationsTable(db)

    for (let migration of migrations) {
        if (!await isMigrationDone(db, migration)) {
            console.log("Correndo migração: " + migration);
            let migrationSql = await readFile(path.join(migrationsDir, migration))

            // TODO: Isto devia estar numa transaction, mas esta biblioteca não as suporta...
            await db.run(migrationSql.toString());
            await db.run("INSERT INTO migrations(name) VALUES(?)", migration)
        }
    }
}
