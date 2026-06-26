/**
 * Seed — datos iniciales para desarrollo/demo
 *
 * Idempotente: usa ON CONFLICT DO NOTHING, se puede correr varias veces.
 * Ejecutar: npm run seed   (requiere DATABASE_URL y migraciones aplicadas)
 */
import 'dotenv/config'
import bcrypt from 'bcrypt'

import pool from '../src/db.js'

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
const DEMO_PASSWORD = 'agro1234'

// NOTA: valores agronómicos REFERENCIALES para la demo; validar con un agrónomo.
const pesticides = [
    { name: 'Mancozeb 80% WP', active: 'Mancozeb' },
    { name: 'Clorpirifos 48% EC', active: 'Clorpirifos' },
    { name: 'Cipermetrina 25% EC', active: 'Cipermetrina' },
    { name: 'Lambda-cihalotrina 5% EC', active: 'Lambda-cihalotrina' },
    { name: 'Metalaxil + Mancozeb', active: 'Metalaxil-M + Mancozeb' },
]

// [cultivo, pesticida, dosis, unidad, frecuencia_días, carencia_días]
const recommendations = [
    ['Papa', 'Mancozeb 80% WP', 2.5, 'kg/ha', 7, 14],
    ['Papa', 'Clorpirifos 48% EC', 1.0, 'L/ha', 14, 21],
    ['Papa', 'Metalaxil + Mancozeb', 2.0, 'kg/ha', 7, 14],
    ['Maíz', 'Cipermetrina 25% EC', 0.3, 'L/ha', 10, 21],
    ['Maíz', 'Lambda-cihalotrina 5% EC', 0.2, 'L/ha', 12, 14],
    ['Tomate', 'Mancozeb 80% WP', 2.0, 'kg/ha', 7, 7],
    ['Tomate', 'Cipermetrina 25% EC', 0.25, 'L/ha', 10, 3],
]

async function seedPesticides() {
    for (const p of pesticides) {
        await pool.query(
            `INSERT INTO pesticides (name, active_ingredient) VALUES ($1, $2)
             ON CONFLICT (name) DO NOTHING`,
            [p.name, p.active],
        )
    }
}

async function seedRecommendations() {
    for (const [crop, pesticide, dose, unit, frequency, withdrawal] of recommendations) {
        await pool.query(
            `INSERT INTO crop_recommendations (crop, id_pesticide, recommended_dose, dose_unit, frequency_days, withdrawal_days)
             SELECT $1, id_pesticide, $2, $3, $4, $5 FROM pesticides WHERE name = $6
             ON CONFLICT (crop, id_pesticide) DO NOTHING`,
            [crop, dose, unit, frequency, withdrawal, pesticide],
        )
    }
}

async function seedDemoUsers() {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS)

    await pool.query(
        `INSERT INTO users (name, email, password_hash, role, district) VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING`,
        ['DRA Huánuco (demo)', 'dra@agroguardian.pe', passwordHash, 'DRA', 'Huánuco'],
    )

    await pool.query(
        `INSERT INTO farmers (name, dni, password_hash, community, district, province, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (dni) DO NOTHING`,
        ['Juan Pérez (demo)', '12345678', passwordHash, 'Cayhuayna', 'Pillco Marca', 'Huánuco', '999888777'],
    )
}

async function seed() {
    await seedPesticides()
    await seedRecommendations()
    await seedDemoUsers()
    console.log('✓ Seed completado.')
    console.log(`  Demo institucional → dra@agroguardian.pe / ${DEMO_PASSWORD}`)
    console.log(`  Demo agricultor    → DNI 12345678 / ${DEMO_PASSWORD}`)
}

seed()
    .then(() => pool.end())
    .catch((err) => {
        console.error('✗ Seed falló:', err.message)
        pool.end()
        process.exit(1)
    })
