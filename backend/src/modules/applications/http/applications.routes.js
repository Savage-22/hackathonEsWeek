import { Router } from 'express'

import ApplicationsController from './applications.Controller.js'
import { validate } from '../../../shared/middleware/validate.js'
import { verifyToken } from '../../../shared/middleware/verifyToken.js'
import { requireRoles } from '../../../shared/middleware/requireRoles.js'
import { uploadSinglePhoto } from '../../../shared/middleware/upload.js'
import { validateApplicationCreate } from './applications.validators.js'

const router = Router()

// Solo el agricultor registra aplicaciones, y únicamente en sus propias parcelas.
// uploadSinglePhoto va antes del validador: multer puebla req.body con los
// campos de texto del multipart y req.file con la foto.
router.post(
    '/',
    verifyToken,
    requireRoles('FARMER'),
    uploadSinglePhoto,
    validate(validateApplicationCreate),
    ApplicationsController.create,
)
router.get('/', verifyToken, requireRoles('FARMER'), ApplicationsController.listByPlot)

export default router
