import { Router } from 'express'

import authRoutes from './auth/http/auth.routes.js'
import syncRoutes from './sync/http/sync.routes.js'
import farmersRoutes from './farmers/http/farmers.routes.js'
import plotsRoutes from './plots/http/plots.routes.js'

/**
 * Registro central de módulos
 *
 * Cada módulo de dominio monta aquí su router. Se van agregando conforme se
 * implementan (applications #16, traceability #20, ...).
 */

const router = Router()

router.use('/auth', authRoutes)
router.use('/sync', syncRoutes)
router.use('/farmers', farmersRoutes)
router.use('/plots', plotsRoutes)

export default router
