import { Router } from 'express'

import StatsController from './stats.Controller.js'
import { verifyToken } from '../../../shared/middleware/verifyToken.js'
import { requireRoles } from '../../../shared/middleware/requireRoles.js'

const router = Router()

// Todo el panel es solo para roles institucionales; un agricultor recibe 403.
const institutionalOnly = [verifyToken, requireRoles('DRA', 'MUNICIPALIDAD', 'COOPERATIVA')]

router.get('/overview', ...institutionalOnly, StatsController.getOverview)
router.get('/farmers', ...institutionalOnly, StatsController.getFarmers)
router.get('/plots', ...institutionalOnly, StatsController.getPlots)

export default router
