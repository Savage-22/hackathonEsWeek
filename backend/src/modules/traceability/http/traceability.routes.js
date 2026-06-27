import { Router } from 'express'

import TraceabilityController from './traceability.Controller.js'
import { validate } from '../../../shared/middleware/validate.js'
import { verifyToken } from '../../../shared/middleware/verifyToken.js'
import { requireRoles } from '../../../shared/middleware/requireRoles.js'
import { validateBatchCreate } from './traceability.validators.js'

const router = Router()

// Generar lote: solo el agricultor, y únicamente sobre sus propias parcelas.
router.post(
    '/batches',
    verifyToken,
    requireRoles('FARMER'),
    validate(validateBatchCreate),
    TraceabilityController.generateBatch,
)

// Ficha pública por código: SIN autenticación (la abre el comprador al escanear).
router.get('/:code', TraceabilityController.getPublic)

export default router
