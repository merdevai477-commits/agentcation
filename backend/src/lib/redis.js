import Redis from 'ioredis'
import { env } from '../config/env.js'

const globalForRedis = globalThis

function createRedis() {
  if (!env.redisUrl) {
    return null
  }

  const client = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
  })

  client.on('error', (err) => {
    console.error('[redis]', err.message)
  })

  return client
}

export const redis = globalForRedis.redis ?? createRedis()

if (process.env.NODE_ENV !== 'production' && redis) {
  globalForRedis.redis = redis
}

export async function pingRedis() {
  if (!redis) return { ok: false, error: 'REDIS_URL not configured' }
  if (redis.status !== 'ready') {
    await redis.connect()
  }
  const pong = await redis.ping()
  return { ok: pong === 'PONG' }
}
