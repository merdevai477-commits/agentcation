import type { PlatformId } from './types'

export type CustomizeKind =
  | 'unanswered'
  | 'out_of_context'
  | 'profanity'
  | 'knowledge'
  | 'pricing'

export type CustomizeStatus = 'open' | 'in_review' | 'resolved'

export type CustomizeItem = {
  id: string
  kind: CustomizeKind
  status: CustomizeStatus
  question: string
  questionAr: string
  note?: string
  noteAr?: string
  clientName: string
  platformId: PlatformId
  at: string
  suggestedFix?: string
  suggestedFixAr?: string
}

export type DeviMessage = {
  id: string
  role: 'user' | 'devi'
  text: string
  at: string
}
