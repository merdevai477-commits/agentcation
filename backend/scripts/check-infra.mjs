import { prisma } from '../src/lib/prisma.js'
import { pingRedis, redis } from '../src/lib/redis.js'

const tables = await prisma.$queryRaw`
  SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
`
console.log('postgres tables:', tables.map((t) => t.tablename))

const redisResult = await pingRedis()
console.log('redis:', redisResult)

await prisma.$disconnect()
if (redis) await redis.quit()
