import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  sessionClear,
  sessionEvents,
  sessionStart,
  sessionStatus,
  sessionStop,
} from '../controllers/whatsappController.js'

const router = Router()

router.use(requireAuth)
router.get('/session', sessionStatus)
router.post('/start', sessionStart)
router.post('/stop', sessionStop)
router.post('/clear', sessionClear)
router.get('/events', sessionEvents)

export default router
