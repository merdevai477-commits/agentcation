import { Router } from 'express'
import authRoutes from './authRoutes.js'
import { prisma } from '../lib/prisma.js'
import { pingRedis } from '../lib/redis.js'

const router = Router()

router.get('/health', async (_req, res) => {
  const checks = { database: false, redis: false }

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

export default router
