import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import modules from './modules/index.js'
import { globalErrorHandler } from './shared/globalErrorHandler.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AgroGuardian API operativa',
        data: { status: 'ok', timestamp: new Date().toISOString() },
    })
})

app.use('/api', modules)

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`AgroGuardian backend escuchando en http://localhost:${PORT}`)
})
