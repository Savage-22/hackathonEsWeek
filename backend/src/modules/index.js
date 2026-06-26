import { Router } from 'express'

import authRoutes from './auth/http/auth.routes.js'
import syncRoutes from './sync/http/sync.routes.js'

/**
 * Registro central de módulos
 *
 * Cada módulo de dominio monta aquí su router. Se van agregando conforme se
 * implementan (farmers #11, plots #12, ...).
 */

const router = Router()

router.use('/auth', authRoutes)
router.use('/sync', syncRoutes)

export default router
