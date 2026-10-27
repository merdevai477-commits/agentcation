export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'open' | 'investigating' | 'awaiting_approval' | 'resolved'

export type DaveIncident = {
  id: string
  title: string
  titleAr: string
  service: string
  severity: IncidentSeverity
  status: IncidentStatus
  at: string
  summary: string
  summaryAr: string
}

export type DaveRepo = {
  id: string
  name: string
  provider: 'github' | 'gitlab'
  branch: string
  connected: boolean
  lastScanAt?: string
}

export type DaveApproval = {
  id: string
  incidentId: string
  title: string
  titleAr: string
  risk: 'low' | 'medium' | 'high'
  at: string
  detail: string
  detailAr: string
}
