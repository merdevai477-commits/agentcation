import { spawnSync } from 'node:child_process'

const hasDb = Boolean(process.env.DATABASE_URL?.trim())

if (hasDb) {
  console.log('[start] Running prisma migrate deploy…')
  const migrate = spawnSync(
    'npx',
    ['prisma', 'migrate', 'deploy', '--schema=backend/prisma/schema.prisma'],
    { stdio: 'inherit', shell: true },
  )
  if (migrate.status !== 0) {
    console.error('[start] prisma migrate deploy failed')
    process.exit(migrate.status ?? 1)
  }
} else {
  console.warn(
    '[start] DATABASE_URL is empty — skipping migrations. WhatsApp/Bizniz APIs need DATABASE_URL.',
  )
}

const next = spawnSync('npx', ['next', 'start'], { stdio: 'inherit', shell: true })
process.exit(next.status ?? 1)
