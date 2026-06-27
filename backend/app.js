import express from 'express'
import cors from 'cors'

import modules from './src/modules/index.js'
import { globalErrorHandler } from './src/shared/globalErrorHandler.js'
import { UPLOADS_DIR } from './src/shared/middleware/upload.js'

const app = express()

app.use(cors())
app.use(express.json())

// Fotos de las aplicaciones (#16) servidas como archivos estáticos.
app.use('/uploads', express.static(UPLOADS_DIR))

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