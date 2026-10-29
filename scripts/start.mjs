import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

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

// Prefer durable WhatsApp session storage (Railway volume at /data)
const sessionsDir =
  process.env.WHATSAPP_SESSIONS_DIR?.trim() ||
  (process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, '.wa-sessions')
    : '') ||
  (fs.existsSync('/data') ? '/data/.wa-sessions' : path.resolve('.wa-sessions'))
try {
  fs.mkdirSync(sessionsDir, { recursive: true })
  if (!process.env.WHATSAPP_SESSIONS_DIR) {
    process.env.WHATSAPP_SESSIONS_DIR = sessionsDir
  }
  console.log('[start] WHATSAPP_SESSIONS_DIR =', process.env.WHATSAPP_SESSIONS_DIR)
  if (!String(process.env.WHATSAPP_SESSIONS_DIR).includes('/data')) {
    console.warn(
      '[start] WhatsApp sessions may be ephemeral. Mount a Railway volume at /data and set WHATSAPP_SESSIONS_DIR=/data/.wa-sessions',
    )
  }
} catch (err) {
  console.warn('[start] could not prepare sessions dir', err)
}

const next = spawnSync('npx', ['next', 'start'], { stdio: 'inherit', shell: true })
process.exit(next.status ?? 1)
