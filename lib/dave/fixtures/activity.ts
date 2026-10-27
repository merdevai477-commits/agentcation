import type { ActivityItem, FeedItem } from './types'

/** What the assistant is shown doing. Sample timeline, not a live agent. */
export const ACTIVITY: ActivityItem[] = [
  { id: 'act_1', projectId: 'prj_auth', at: '2026-10-21T15:12:00Z', state: 'monitoring', title: 'Watching auth-gateway latency', detail: 'No new page. The open investigation continues.', href: '/dashboard/monitoring' },
  { id: 'act_2', projectId: 'prj_billing', at: '2026-10-21T15:08:00Z', state: 'collecting_evidence', title: 'Queue lag has logs missing', detail: 'Billing connection is an example disconnected state, so collection stopped.', href: '/dashboard/incidents/inc_queue' },
  { id: 'act_3', projectId: 'prj_auth', at: '2026-10-21T12:18:00Z', state: 'investigating', title: 'Auth latency investigation', detail: 'Redis timeouts are confirmed in the trace sample. Cause is still a hypothesis.', href: '/dashboard/incidents/inc_auth' },
  { id: 'act_4', projectId: 'prj_checkout', at: '2026-10-21T14:31:00Z', state: 'analyzing_code', title: 'Read checkout v2.14.1', detail: 'Retry loop identified in c4e91ab.', href: '/dashboard/tasks/tsk_pool_code' },
  { id: 'act_5', projectId: 'prj_checkout', at: '2026-10-21T14:38:00Z', state: 'preparing_fix', title: 'Prepared PR #482', detail: 'Proposal only. Not approved.', href: '/dashboard/code/pr_482' },
  { id: 'act_6', projectId: 'prj_checkout', at: '2026-10-21T14:39:00Z', state: 'waiting_approval', title: 'Waiting for a person', detail: 'Checkout incident stays in Awaiting Approval.', href: '/dashboard/incidents/inc_pool' },
  { id: 'act_7', projectId: 'prj_checkout', at: '2026-10-21T14:43:00Z', state: 'running_tests', title: 'Smoke tests did not start', detail: 'No runner is connected.', href: '/dashboard/tasks/tsk_tests' },
  { id: 'act_8', projectId: 'prj_billing', at: '2026-10-21T09:16:00Z', state: 'verifying_deployment', title: 'Checking RSS after dpl_228', detail: 'Deploy succeeded. Verification has not passed.', href: '/dashboard/incidents/inc_mem' },
  { id: 'act_9', projectId: 'prj_docs', at: '2026-10-19T11:45:00Z', state: 'resolved', title: 'CDN incident verified', detail: 'Hit ratio held for the full window.', href: '/dashboard/incidents/inc_cdn' },
  { id: 'act_10', projectId: 'prj_checkout', at: '2026-10-21T14:43:00Z', state: 'failed', title: 'Test task failed', detail: 'Runner missing. Incident was not updated to resolved.', href: '/dashboard/tasks/tsk_tests' },
  { id: 'act_11', projectId: 'prj_auth', at: '2026-10-21T07:04:00Z', state: 'needs_human', title: 'Signing key needs a person', detail: 'Automation stopped before any secret change.', href: '/dashboard/incidents/inc_secret' },
]

export const FEED: FeedItem[] = [
  { id: 'fd_1', projectId: 'prj_checkout', at: '2026-10-21T14:20:00Z', kind: 'incident', title: 'New incident · checkout 500s', detail: 'Critical. Fix is only proposed.', href: '/dashboard/incidents/inc_pool' },
  { id: 'fd_2', projectId: 'prj_checkout', at: '2026-10-21T14:12:00Z', kind: 'deployment', title: 'dpl_214 succeeded', detail: 'The incident started after this deploy. Success is not recovery.', href: '/dashboard/monitoring' },
  { id: 'fd_3', projectId: 'prj_checkout', at: '2026-10-21T14:38:00Z', kind: 'pull_request', title: 'PR #482 opened', detail: 'Awaiting approval. Not merged.', href: '/dashboard/code/pr_482' },
  { id: 'fd_4', projectId: 'prj_checkout', at: '2026-10-21T14:43:00Z', kind: 'tests', title: 'Checkout smoke tests failed to start', detail: 'No execution environment.', href: '/dashboard/tasks/tsk_tests' },
  { id: 'fd_5', projectId: 'prj_billing', at: '2026-10-21T09:30:00Z', kind: 'report', title: 'Memory report updated', detail: 'Cause still marked as a hypothesis.', href: '/dashboard/reports/rpt_mem' },
  { id: 'fd_6', projectId: 'prj_billing', at: '2026-10-21T09:16:00Z', kind: 'verification', title: 'RSS verification still pending', detail: 'Applied fix is not a verified resolution.', href: '/dashboard/incidents/inc_mem' },
  { id: 'fd_7', projectId: 'prj_docs', at: '2026-10-19T11:45:00Z', kind: 'verification', title: 'CDN verification passed', detail: 'The one sample incident that is fully verified.', href: '/dashboard/incidents/inc_cdn' },
]

export const NOTIFICATIONS = [
  { id: 'nt_1', title: 'Approval needed', body: 'PR #482 is a proposal for checkout. The incident is still open.', href: '/dashboard/incidents/inc_pool', at: '2026-10-21T14:39:00Z' },
  { id: 'nt_2', title: 'Verification still running', body: 'Billing RSS has not met the pass rule after dpl_228.', href: '/dashboard/incidents/inc_mem', at: '2026-10-21T09:40:00Z' },
  { id: 'nt_3', title: 'A person is required', body: 'Signing key age is past policy. Dave Doctor will not rotate it.', href: '/dashboard/incidents/inc_secret', at: '2026-10-21T07:04:00Z' },
  { id: 'nt_4', title: 'Incident reopened', body: 'Checkout lock timeouts returned. The earlier verification failed.', href: '/dashboard/incidents/inc_lock', at: '2026-10-21T06:12:00Z' },
]
