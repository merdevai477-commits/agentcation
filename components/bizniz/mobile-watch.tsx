'use client'

import { DEMO_CLIENTS, DEMO_CONNECTED_APPS, DEMO_RECENT_LOGS } from '@/lib/bizniz/demo-data'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime } from '@/lib/bizniz/store'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { PlatformIcon } from './platform-icon'

export function BiznizMobileWatch() {
  const { lang } = useBiznizLang()
  const apps = DEMO_CONNECTED_APPS
  const logs = DEMO_RECENT_LOGS.slice(0, 5)
  const clients = DEMO_CLIENTS.slice(0, 4)

  return (
    <section className="watch" aria-label={lang === 'ar' ? 'متابعة' : 'Follow-up'}>
      <header className="watch__head">
        <p>{lang === 'ar' ? 'متابعة الموبايل' : 'Mobile follow-up'}</p>
        <h1>{lang === 'ar' ? 'القنوات والعملاء' : 'Channels and clients'}</h1>
        <span>{lang === 'ar' ? 'الإعداد الكامل على الكمبيوتر.' : 'Setup and automations stay on desktop.'}</span>
      </header>

      <div className="watch__channels">
        {apps.map((app) => (
          <article key={app.id} className={`watch__channel is-${app.status}`}>
            <PlatformIcon id={app.platformId} size={18} />
            <strong>{platformLabel(app.platformId)}</strong>
            <span>{app.status === 'active' ? (lang === 'ar' ? 'شغال' : 'Live') : app.status === 'paused' ? (lang === 'ar' ? 'متوقف' : 'Paused') : (lang === 'ar' ? 'غير مربوط' : 'Off')}</span>
          </article>
        ))}
      </div>

      <article className="watch__card">
        <h2>{lang === 'ar' ? 'آخر العملاء' : 'Latest clients'}</h2>
        <ol>
          {clients.map((client) => (
            <li key={client.id}>
              <div>
                <strong>{client.name}</strong>
                <span>{client.platforms.map((id) => platformLabel(id)).join(' · ')}</span>
              </div>
              <time>{relativeTime(client.lastMessageAt)}</time>
            </li>
          ))}
        </ol>
      </article>

      <article className="watch__card">
        <h2>{lang === 'ar' ? 'آخر النشاط' : 'Recent activity'}</h2>
        <ol>
          {logs.map((log) => (
            <li key={log.id}>
              <PlatformIcon id={log.platformId} size={14} />
              <div>
                <strong>{log.clientName}</strong>
                <span>{log.customerMessage}</span>
              </div>
            </li>
          ))}
        </ol>
      </article>
    </section>
  )
}
