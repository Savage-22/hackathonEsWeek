import { Router } from 'express'

import authRoutes from './auth/http/auth.routes.js'
import syncRoutes from './sync/http/sync.routes.js'
import farmersRoutes from './farmers/http/farmers.routes.js'
import plotsRoutes from './plots/http/plots.routes.js'
import pesticidesRoutes from './pesticides/http/pesticides.routes.js'
import applicationsRoutes from './applications/http/applications.routes.js'

/**
 * Registro central de módulos
 *
 * Cada módulo de dominio monta aquí su router. Se van agregando conforme se
 * implementan (traceability #20, dashboard #23, ...).
 */

const router = Router()

router.use('/auth', authRoutes)
router.use('/sync', syncRoutes)
router.use('/farmers', farmersRoutes)
router.use('/plots', plotsRoutes)
router.use('/pesticides', pesticidesRoutes)
router.use('/applications', applicationsRoutes)

export default router
