import { Router } from 'express'

import SyncController from './sync.Controller.js'
import { validate } from '../../../shared/middleware/validate.js'
import { verifyToken } from '../../../shared/middleware/verifyToken.js'
import { requireRoles } from '../../../shared/middleware/requireRoles.js'
import { validateSyncPush } from './sync.validators.js'

const router = Router()

// Solo el agricultor sincroniza, y únicamente sus propios datos.
router.post('/', verifyToken, requireRoles('FARMER'), validate(validateSyncPush), SyncController.push)
router.get('/', verifyToken, requireRoles('FARMER'), SyncController.pull)

export default router
