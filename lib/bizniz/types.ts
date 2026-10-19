export type PlatformId = 'whatsapp' | 'instagram' | 'telegram' | 'messenger'

export type ConnectionStatus = 'active' | 'paused' | 'disconnected' | 'error' | 'available'

export type BiznizPlatform = {
  id: PlatformId
  name: string
  brandColor: string
  /** Whether a real OAuth/session connector exists in this repo */
  connectorAvailable: boolean
}

export type ConnectedApp = {
  id: string
  platformId: PlatformId
  status: ConnectionStatus
  accountLabel?: string
  connectedAt?: string
  automationPaused: boolean
  messagesThisMonth: number
  messageDeltaPct?: number
}

export type BiznizClient = {
  id: string
  name: string
  initials: string
  platforms: PlatformId[]
  lastMessageAt: string
  lastPreview: string
}

export type ConversationMessage = {
  id: string
  role: 'customer' | 'ai'
  text: string
  at: string
}

export type Conversation = {
  id: string
  clientId: string
  clientName: string
  initials: string
  platformId: PlatformId
  updatedAt: string
  preview: string
  messages: ConversationMessage[]
}

export type Automation = {
  id: string
  name: string
  platformId: PlatformId
  status: 'active' | 'paused'
  lastActivityAt: string
  messageCount: number
}

export type RecentLog = {
  id: string
  clientName: string
  initials: string
  platformId: PlatformId
  customerMessage: string
  aiResponse: string
  at: string
  conversationId: string
}

export type ChartPoint = {
  label: string
  value: number
  date: string
}
