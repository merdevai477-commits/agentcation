/**
 * DEMO DATA for the Dev Bizniz (Business Agents) dashboard.
 * Not backed by WhatsApp/Instagram APIs in this repository.
 * Connection mutations are persisted in localStorage only.
 */

import type {
  Automation,
  ChartPoint,
  ConnectedApp,
  Conversation,
  BiznizClient,
  RecentLog,
} from './types'

export const BIZNIZ_DEMO_LABEL =
  'LIVE WhatsApp when linked · other channels remain demo until their connectors ship'

export const DEMO_CONNECTED_APPS: ConnectedApp[] = [
  {
    id: 'app_wa_1',
    platformId: 'whatsapp',
    status: 'disconnected',
    accountLabel: undefined,
    connectedAt: undefined,
    automationPaused: true,
    messagesThisMonth: 0,
    messageDeltaPct: undefined,
  },
  {
    id: 'app_ig_1',
    platformId: 'instagram',
    status: 'disconnected',
    accountLabel: undefined,
    connectedAt: undefined,
    automationPaused: true,
    messagesThisMonth: 0,
    messageDeltaPct: undefined,
  },
  {
    id: 'app_tg_1',
    platformId: 'telegram',
    status: 'disconnected',
    accountLabel: undefined,
    connectedAt: undefined,
    automationPaused: true,
    messagesThisMonth: 0,
    messageDeltaPct: undefined,
  },
  {
    id: 'app_ms_1',
    platformId: 'messenger',
    status: 'disconnected',
    accountLabel: undefined,
    connectedAt: undefined,
    automationPaused: true,
    messagesThisMonth: 0,
    messageDeltaPct: undefined,
  },
]

export const DEMO_CHART_SERIES: ChartPoint[] = [
  { date: '2026-10-01', label: 'Oct 1', value: 42 },
  { date: '2026-10-03', label: 'Oct 3', value: 58 },
  { date: '2026-10-05', label: 'Oct 5', value: 71 },
  { date: '2026-10-07', label: 'Oct 7', value: 63 },
  { date: '2026-10-09', label: 'Oct 9', value: 88 },
  { date: '2026-10-11', label: 'Oct 11', value: 95 },
  { date: '2026-10-13', label: 'Oct 13', value: 102 },
  { date: '2026-10-15', label: 'Oct 15', value: 110 },
  { date: '2026-10-17', label: 'Oct 17', value: 126 },
  { date: '2026-10-19', label: 'Oct 19', value: 134 },
]

export const DEMO_CLIENTS: BiznizClient[] = [
  {
    id: 'cli_kora',
    name: 'Kora Store',
    initials: 'KS',
    platforms: ['instagram', 'whatsapp'],
    lastMessageAt: '2026-10-19T14:40:00Z',
    lastPreview: 'Do you have a free trial?',
  },
  {
    id: 'cli_nile',
    name: 'Nile Fashion',
    initials: 'NF',
    platforms: ['whatsapp'],
    lastMessageAt: '2026-10-19T13:12:00Z',
    lastPreview: 'Can I change my delivery address?',
  },
  {
    id: 'cli_omar',
    name: 'Omar Hassan',
    initials: 'OH',
    platforms: ['telegram'],
    lastMessageAt: '2026-10-19T11:05:00Z',
    lastPreview: 'What are your working hours?',
  },
  {
    id: 'cli_sara',
    name: 'Sara Boutique',
    initials: 'SB',
    platforms: ['messenger', 'instagram'],
    lastMessageAt: '2026-10-18T19:22:00Z',
    lastPreview: 'Do you ship to Alexandria?',
  },
  {
    id: 'cli_tech',
    name: 'Tech Corner',
    initials: 'TC',
    platforms: ['whatsapp'],
    lastMessageAt: '2026-10-18T16:01:00Z',
    lastPreview: 'Is the Pro plan refundable?',
  },
]

export const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_kora_ig',
    clientId: 'cli_kora',
    clientName: 'Kora Store',
    initials: 'KS',
    platformId: 'instagram',
    updatedAt: '2026-10-19T14:40:00Z',
    preview: 'Do you have a free trial?',
    messages: [
      {
        id: 'm1',
        role: 'customer',
        text: 'Hi! Do you have a free trial?',
        at: '2026-10-19T14:38:00Z',
      },
      {
        id: 'm2',
        role: 'ai',
        text: 'Yes — we offer a 7-day free trial on the Plus plan. Want me to send the signup link?',
        at: '2026-10-19T14:38:40Z',
      },
      {
        id: 'm3',
        role: 'customer',
        text: 'Do you have a free trial?',
        at: '2026-10-19T14:40:00Z',
      },
      {
        id: 'm4',
        role: 'ai',
        text: 'Yes, we offer a 7-day free trial.',
        at: '2026-10-19T14:40:25Z',
      },
    ],
  },
  {
    id: 'conv_nile_wa',
    clientId: 'cli_nile',
    clientName: 'Nile Fashion',
    initials: 'NF',
    platformId: 'whatsapp',
    updatedAt: '2026-10-19T13:12:00Z',
    preview: 'Can I change my delivery address?',
    messages: [
      {
        id: 'm5',
        role: 'customer',
        text: 'Can I change my delivery address?',
        at: '2026-10-19T13:10:00Z',
      },
      {
        id: 'm6',
        role: 'ai',
        text: 'I can help with that. Address changes are available before the order ships. Share your order number and the new address.',
        at: '2026-10-19T13:12:00Z',
      },
    ],
  },
  {
    id: 'conv_omar_tg',
    clientId: 'cli_omar',
    clientName: 'Omar Hassan',
    initials: 'OH',
    platformId: 'telegram',
    updatedAt: '2026-10-19T11:05:00Z',
    preview: 'What are your working hours?',
    messages: [
      {
        id: 'm7',
        role: 'customer',
        text: 'What are your working hours?',
        at: '2026-10-19T11:04:00Z',
      },
      {
        id: 'm8',
        role: 'ai',
        text: 'We’re available Sat–Thu, 10:00–22:00 Cairo time. Urgent orders get a same-day reply queue.',
        at: '2026-10-19T11:05:00Z',
      },
    ],
  },
  {
    id: 'conv_sara_ms',
    clientId: 'cli_sara',
    clientName: 'Sara Boutique',
    initials: 'SB',
    platformId: 'messenger',
    updatedAt: '2026-10-18T19:22:00Z',
    preview: 'Do you ship to Alexandria?',
    messages: [
      {
        id: 'm9',
        role: 'customer',
        text: 'Do you ship to Alexandria?',
        at: '2026-10-18T19:20:00Z',
      },
      {
        id: 'm10',
        role: 'ai',
        text: 'Yes — Alexandria deliveries usually arrive in 1–2 business days.',
        at: '2026-10-18T19:22:00Z',
      },
    ],
  },
]

export const DEMO_RECENT_LOGS: RecentLog[] = [
  {
    id: 'log_1',
    clientName: 'Kora Store',
    initials: 'KS',
    platformId: 'instagram',
    customerMessage: 'Do you have a free trial?',
    aiResponse: 'Yes, we offer a 7-day free trial.',
    at: '2026-10-19T14:40:25Z',
    conversationId: 'conv_kora_ig',
  },
  {
    id: 'log_2',
    clientName: 'Nile Fashion',
    initials: 'NF',
    platformId: 'whatsapp',
    customerMessage: 'Can I change my delivery address?',
    aiResponse: 'Address changes are available before the order ships.',
    at: '2026-10-19T13:12:00Z',
    conversationId: 'conv_nile_wa',
  },
  {
    id: 'log_3',
    clientName: 'Omar Hassan',
    initials: 'OH',
    platformId: 'telegram',
    customerMessage: 'What are your working hours?',
    aiResponse: 'Sat–Thu, 10:00–22:00 Cairo time.',
    at: '2026-10-19T11:05:00Z',
    conversationId: 'conv_omar_tg',
  },
]

export const DEMO_AUTOMATIONS: Automation[] = [
  {
    id: 'auto_wa_support',
    name: 'WhatsApp Support Agent',
    platformId: 'whatsapp',
    status: 'paused',
    lastActivityAt: new Date(0).toISOString(),
    messageCount: 0,
  },
]

export const STORAGE_KEY = 'agentication_bizniz_apps_v2'
export const AUTO_STORAGE_KEY = 'agentication_bizniz_autos_v2'

export function uniqueClientCount(clients: BiznizClient[] = DEMO_CLIENTS): number {
  return clients.length
}
