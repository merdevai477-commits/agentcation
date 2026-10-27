import { Router } from 'express'
import authRoutes from './authRoutes.js'
import whatsappRoutes from './whatsappRoutes.js'
import businessStoryRoutes from './businessStoryRoutes.js'
import { prisma } from '../lib/prisma.js'
import { pingRedis } from '../lib/redis.js'
import { env } from '../config/env.js'

const router = Router()

router.get('/health', async (_req, res) => {
  const checks = {
    database: false,
    redis: false,
    openRouter: Boolean(env.openRouterApiKey),
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (err) {
    checks.databaseError = err.message
  }

  try {
    const redis = await pingRedis()
    checks.redis = redis.ok
    if (!redis.ok && redis.error) checks.redisError = redis.error
  } catch (err) {
    checks.redisError = err.message
  }

  const ok = checks.database
  res.status(ok ? 200 : 503).json({
    success: ok,
    status: ok ? 'ok' : 'degraded',
    checks,
  })
})

router.use('/auth', authRoutes)
router.use('/bizniz/whatsapp', whatsappRoutes)
router.use('/bizniz/business-story', businessStoryRoutes)

export default router
