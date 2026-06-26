/**
 * Runner de migraciones
 *
 * Aplica en orden los archivos .sql de src/migrations/ que aún no se hayan
 * aplicado, registrándolos en la tabla _migrations. Cada migración corre dentro
 * de su propia transacción: o se aplica entera o no se aplica.
 *
 * Ejecutar: npm run migrate   (requiere DATABASE_URL)
 */
import 'dotenv/config'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import pool from '../src/db.js'

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'migrations')

async function ensureMigrationsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS _migrations (
            id         SERIAL PRIMARY KEY,
            name       VARCHAR(255) UNIQUE NOT NULL,
            applied_at TIMESTAMPTZ DEFAULT now()
        )
    `)
}

async function getAppliedMigrations() {
    const result = await pool.query('SELECT name FROM _migrations')
    return new Set(result.rows.map((row) => row.name))
}

async function applyMigration(file) {
    const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf8')
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query(sql)
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file])
        await client.query('COMMIT')
        console.log(`✓ Aplicada: ${file}`)
    } catch (error) {
        await client.query('ROLLBACK')
        console.error(`✗ Falló: ${file} — ${error.message}`)
        throw error
    } finally {
        client.release()
    }
}

async function migrate() {
    await ensureMigrationsTable()
    const applied = await getAppliedMigrations()

    const files = (await readdir(MIGRATIONS_DIR))
        .filter((f) => f.endsWith('.sql'))
        .sort()

    const pending = files.filter((f) => !applied.has(f))

    if (pending.length === 0) {
        console.log('No hay migraciones pendientes.')
        return
    }

    for (const file of pending) {
        await applyMigration(file)
    }
    console.log(`Listo. ${pending.length} migración(es) aplicada(s).`)
}

migrate()
    .then(() => pool.end())
    .catch((err) => {
        console.error(err.message)
        pool.end()
        process.exit(1)
    })
