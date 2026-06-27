import { Router } from 'express'

import PlotsController from './plots.Controller.js'
import { validate } from '../../../shared/middleware/validate.js'
import { verifyToken } from '../../../shared/middleware/verifyToken.js'
import { requireRoles } from '../../../shared/middleware/requireRoles.js'
import { validatePlotCreate, validatePlotUpdate } from './plots.validators.js'

const router = Router()

// El agricultor solo gestiona sus propias parcelas (#12).
router.get('/', verifyToken, requireRoles('FARMER'), PlotsController.list)
router.get('/:id', verifyToken, requireRoles('FARMER'), PlotsController.getById)
router.post('/', verifyToken, requireRoles('FARMER'), validate(validatePlotCreate), PlotsController.create)
router.put('/:id', verifyToken, requireRoles('FARMER'), validate(validatePlotUpdate), PlotsController.update)
router.delete('/:id', verifyToken, requireRoles('FARMER'), PlotsController.deactivate)

export default router
