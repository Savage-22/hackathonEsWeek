import express from 'express'
import cors from 'cors'

import modules from './src/modules/index.js'
import { globalErrorHandler } from './src/shared/globalErrorHandler.js'

const app = express()

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

export default app