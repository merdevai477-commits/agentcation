import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getStory, putStory } from '../controllers/businessStoryController.js'

const router = Router()

router.use(requireAuth)
router.get('/', getStory)
router.put('/', putStory)

export default router
