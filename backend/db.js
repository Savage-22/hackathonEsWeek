import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL

// Neon y otros Postgres gestionados exigen SSL
const needsSsl = /neon\.tech|sslmode=require/.test(connectionString || '')

const pool = new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : false,
})

export default pool
