import type { IntegrationCard } from './types'

/** Catalog only. Every card is not connected. */
export const INTEGRATIONS: IntegrationCard[] = [
  {
    id: 'int_github',
    name: 'GitHub',
    kind: 'Repository',
    description: 'Read branches, commits, and pull requests, and later open proposed fixes.',
    capabilities: ['List repositories', 'Read pull requests', 'Open a draft PR after approval'],
    state: 'not_connected',
  },
  {
    id: 'int_railway',
    name: 'Railway',
    kind: 'Hosting',
    description: 'Read deployment status for connected projects. Deploys stay manual in this phase.',
    capabilities: ['List deployments', 'Read build status', 'No automatic deploy'],
    state: 'not_connected',
  },
  {
    id: 'int_slack',
    name: 'Slack',
    kind: 'Notifications',
    description: 'Send incident and approval messages to a channel you choose later.',
    capabilities: ['Incident pages', 'Approval requests', 'Verification results'],
    state: 'not_connected',
  },
  {
    id: 'int_linear',
    name: 'Linear',
    kind: 'Issue tracking',
    description: 'Link an incident to an issue. Creating issues is not available yet.',
    capabilities: ['Link an issue', 'Show status on the incident'],
    state: 'not_connected',
  },
  {
    id: 'int_sentry',
    name: 'Sentry',
    kind: 'Monitoring',
    description: 'Import error groups as evidence. No project is ingesting events.',
    capabilities: ['Read issues', 'Attach a stack trace to an incident'],
    state: 'not_connected',
  },
  {
    id: 'int_datadog',
    name: 'Datadog',
    kind: 'Monitoring',
    description: 'Read metrics and monitors when a provider connection exists.',
    capabilities: ['Query metrics', 'Read monitor state'],
    state: 'not_connected',
    lastSync: '2026-10-18T10:00:00Z',
  },
]
