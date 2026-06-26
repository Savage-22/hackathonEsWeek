import { Router } from 'express'

import AuthController from './auth.Controller.js'
import { validate } from '../../../shared/middleware/validate.js'
import { verifyToken } from '../../../shared/middleware/verifyToken.js'
import { validateFarmerLogin, validateInstitutionalLogin } from './auth.validators.js'

const router = Router()

router.post('/login/farmer', validate(validateFarmerLogin), AuthController.loginFarmer)
router.post('/login', validate(validateInstitutionalLogin), AuthController.loginInstitutional)
router.get('/me', verifyToken, AuthController.me)

export default router
