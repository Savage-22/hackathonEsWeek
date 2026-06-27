import { Router } from 'express'

import PesticidesController from './pesticides.Controller.js'
import { verifyToken } from '../../../shared/middleware/verifyToken.js'

const router = Router()

// Catálogo de solo lectura, disponible para cualquier usuario autenticado.
// La ruta específica de recomendaciones va antes de la paramétrica.
router.get('/', verifyToken, PesticidesController.list)
router.get('/recommendations', verifyToken, PesticidesController.recommendationsByCrop)
router.get('/recommendations/:crop/:idPesticide', verifyToken, PesticidesController.getRecommendation)

export default router
