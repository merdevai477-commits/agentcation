import type { BiznizPlatform, PlatformId } from './types'

export const PLATFORMS: BiznizPlatform[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    brandColor: '#25D366',
    /** Baileys QR session + OpenRouter auto-reply */
    connectorAvailable: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    brandColor: '#E1306C',
    connectorAvailable: false,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    brandColor: '#2AABEE',
    connectorAvailable: false,
  },
  {
    id: 'messenger',
    name: 'Messenger',
    brandColor: '#0084FF',
    connectorAvailable: false,
  },
]

export function getPlatform(id: PlatformId): BiznizPlatform {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]!
}

export function platformLabel(id: PlatformId): string {
  return getPlatform(id).name
}
