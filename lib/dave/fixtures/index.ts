import { ACTIVITY, FEED } from './activity'
import { PULLS, REPOS } from './code'
import { INCIDENTS } from './incidents'
import { KNOWLEDGE } from './knowledge'
import { DEPLOYMENTS, LOGS } from './monitoring'
import { PROJECTS } from './projects'
import { REPORTS } from './reports'
import { TASKS } from './tasks'

export * from './activity'
export * from './automation'
export * from './code'
export * from './incidents'
export * from './integrations'
export * from './knowledge'
export * from './monitoring'
export * from './projects'
export * from './reports'
export * from './tasks'
export * from './types'
export * from './usage'

export function projectsIn(workspaceId: string) {
  return PROJECTS.filter((project) => project.workspaceId === workspaceId)
}

export function inScope<T extends { projectId: string }>(rows: T[], workspaceId: string, projectId: string) {
  const allowed = new Set(projectsIn(workspaceId).map((project) => project.id))
  return rows.filter((row) => allowed.has(row.projectId) && (projectId === 'all' || row.projectId === projectId))
}

export function projectById(id: string) {
  return PROJECTS.find((project) => project.id === id)
}

export function incidentById(id: string) {
  return INCIDENTS.find((incident) => incident.id === id)
}

export function taskById(id: string) {
  return TASKS.find((task) => task.id === id)
}

export function pullById(id: string) {
  return PULLS.find((pull) => pull.id === id)
}

export function reportById(id: string) {
  return REPORTS.find((report) => report.id === id)
}

export function knowledgeById(id: string) {
  return KNOWLEDGE.find((entry) => entry.id === id)
}

export function repoById(id: string) {
  return REPOS.find((repo) => repo.id === id)
}

export function deploymentById(id: string) {
  return DEPLOYMENTS.find((deployment) => deployment.id === id)
}

export const ACTIVE_INCIDENT: ReadonlySet<string> = new Set([
  'detected',
  'investigating',
  'awaiting_approval',
  'fix_prepared',
  'fix_applied',
  'verifying',
  'reopened',
  'needs_human',
])

export function overviewCounts(workspaceId: string, projectId: string) {
  const incidents = inScope(INCIDENTS, workspaceId, projectId)
  const tasks = inScope(TASKS, workspaceId, projectId)
  const deployments = inScope(DEPLOYMENTS, workspaceId, projectId)
  const projects = projectsIn(workspaceId).filter((project) => projectId === 'all' || project.id === projectId)
  return {
    projects: projects.length,
    activeIncidents: incidents.filter((incident) => ACTIVE_INCIDENT.has(incident.status)).length,
    investigations: incidents.filter((incident) =>
      ['investigating', 'awaiting_approval', 'verifying', 'needs_human'].includes(incident.status),
    ).length,
    awaitingVerification: tasks.filter((task) => task.verification === 'pending' || task.verification === 'not_started' && task.status === 'completed').length,
    deployments: deployments.length,
    verified: incidents.filter((incident) => incident.verification === 'passed').length,
  }
}

export function scopedActivity(workspaceId: string, projectId: string) {
  return inScope(ACTIVITY, workspaceId, projectId)
}

export function scopedFeed(workspaceId: string, projectId: string) {
  return inScope(FEED, workspaceId, projectId)
}

export function scopedLogs(workspaceId: string, projectId: string) {
  return inScope(LOGS, workspaceId, projectId)
}
