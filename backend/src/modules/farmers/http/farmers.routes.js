import { Router } from 'express'

import FarmersController from './farmers.Controller.js'
import { validate } from '../../../shared/middleware/validate.js'
import { verifyToken } from '../../../shared/middleware/verifyToken.js'
import { validateFarmerCreate, validateFarmerUpdate } from './farmers.validators.js'

const router = Router()

// Lectura y escritura de agricultores: protegido por autenticación (#11).
router.get('/', verifyToken, FarmersController.list)
router.get('/:id', verifyToken, FarmersController.getById)
router.post('/', verifyToken, validate(validateFarmerCreate), FarmersController.create)
router.put('/:id', verifyToken, validate(validateFarmerUpdate), FarmersController.update)
router.delete('/:id', verifyToken, FarmersController.deactivate)

export default router
