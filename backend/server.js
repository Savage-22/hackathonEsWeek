import 'dotenv/config'

import app from './app.js'
import pool from './db.js'

const PORT = process.env.PORT || 4000

async function startServer() {
    try {
        await pool.query('SELECT 1')

        console.log('Database connection established successfully.')

        app.listen(PORT, () => {
            console.log(`AgroGuardian backend is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Failed to connect to the database:', error)
        process.exit(1)
    }
}

startServer()