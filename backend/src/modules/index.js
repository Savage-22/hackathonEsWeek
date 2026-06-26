import { Router } from 'express'

/**
 * Registro central de módulos
 *
 * Cada módulo de dominio monta aquí su router. Se van agregando conforme se
 * implementan (auth #5, farmers #11, plots #12, ...).
 */

const router = Router()

// router.use('/farmers', farmerRoutes)

export default router
