/** Frontend sample models for Dave Doctor. These are not production records. */

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d'
export type PreviewState = 'ready' | 'loading' | 'empty' | 'error' | 'denied' | 'disconnected'

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type Health = 'healthy' | 'degraded' | 'down' | 'unknown'
export type Environment = 'production' | 'staging' | 'preview'
export type ConnectionExample = 'sample-connected' | 'sample-degraded' | 'sample-disconnected'

export type IncidentStatus =
  | 'detected'
  | 'investigating'
  | 'awaiting_approval'
  | 'fix_prepared'
  | 'fix_applied'
  | 'verifying'
  | 'resolved'
  | 'reopened'
  | 'needs_human'

export type FixStage = 'none' | 'proposed' | 'approved' | 'applied' | 'verified'
export type Verification = 'not_started' | 'pending' | 'passed' | 'failed' | 'not_applicable'
export type EvidenceKind = 'confirmed' | 'hypothesis'

export type TaskType =
  | 'log_investigation'
  | 'memory_investigation'
  | 'code_analysis'
  | 'pr_review'
  | 'test_execution'
  | 'deployment_verification'
  | 'architecture_analysis'
  | 'knowledge_update'

export type TaskRunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'blocked'
export type Priority = 'p1' | 'p2' | 'p3' | 'p4'

export type ReportCategory =
  | 'incident'
  | 'memory'
  | 'deployment'
  | 'code_review'
  | 'task'
  | 'health'

export type KnowledgeCategory =
  | 'architecture'
  | 'services'
  | 'modules'
  | 'incidents'
  | 'fixes'
  | 'runbooks'
  | 'docs'
  | 'risks'

export type ActivityState =
  | 'monitoring'
  | 'collecting_evidence'
  | 'investigating'
  | 'analyzing_code'
  | 'preparing_fix'
  | 'waiting_approval'
  | 'running_tests'
  | 'verifying_deployment'
  | 'resolved'
  | 'failed'
  | 'needs_human'

export type AutomationMode = 'enabled' | 'paused' | 'disabled'

export type DoctorProject = {
  id: string
  workspaceId: string
  name: string
  description: string
  repoProvider: 'GitHub' | 'GitLab'
  hostProvider: 'Railway' | 'Sample host'
  environment: Environment
  connection: ConnectionExample
  health: Health
  latestDeploymentId: string
  latestIncidentId?: string
  repoId: string
  service: string
}

export type DoctorIncident = {
  id: string
  projectId: string
  title: string
  severity: Severity
  environment: Environment
  status: IncidentStatus
  detectedAt: string
  investigation: string
  verification: Verification
  suspectedCause: string
  causeKind: EvidenceKind
  confidence: number
  step: string
  summary: string
  timeline: { at: string; title: string; detail: string }[]
  logs: { at: string; severity: 'INFO' | 'WARN' | 'ERROR'; service: string; message: string; traceId: string }[]
  metrics: { label: string; value: string; note: string }[]
  commits: { sha: string; message: string; at: string }[]
  deployments: { id: string; status: string; at: string; note: string }[]
  evidence: { source: string; kind: EvidenceKind; text: string }[]
  remediation: string
  pullRequestId?: string
  fixStage: FixStage
  verificationDetail: string
  risks: string[]
  reportId?: string
}

export type DoctorTask = {
  id: string
  title: string
  type: TaskType
  projectId: string
  status: TaskRunStatus
  priority: Priority
  createdAt: string
  incidentId?: string
  result: string
  verification: Verification
  objective: string
  timeline: { at: string; title: string; detail: string }[]
  evidence: { source: string; kind: EvidenceKind; text: string }[]
  actions: string[]
  errors: string[]
  approvals: { at: string; actor: string; decision: string }[]
  outcome: string
}

export type DoctorRepo = {
  id: string
  projectId: string
  name: string
  provider: 'GitHub' | 'GitLab'
  defaultBranch: string
  connection: ConnectionExample
  ci: string
}

export type DoctorBranch = {
  id: string
  repoId: string
  projectId: string
  name: string
  ahead: number
  updatedAt: string
  protected: boolean
}

export type DoctorCommit = {
  sha: string
  repoId: string
  projectId: string
  message: string
  author: string
  at: string
  branch: string
}

export type DoctorPull = {
  id: string
  number: number
  projectId: string
  repoId: string
  title: string
  purpose: string
  incidentId?: string
  branch: string
  base: string
  status: 'draft' | 'open' | 'merged'
  review: string
  ci: 'passing' | 'failing' | 'pending' | 'skipped'
  deploy: string
  fixStage: FixStage
  files: { path: string; additions: number; deletions: number }[]
  tests: string[]
  risks: string[]
  summary: string
  openedAt: string
}

export type DoctorReport = {
  id: string
  category: ReportCategory
  title: string
  projectId: string
  environment: Environment
  rangeLabel: string
  updatedAt: string
  executive: string
  sources: { name: string; kind: EvidenceKind; detail: string }[]
  findings: { kind: EvidenceKind; text: string }[]
  cause: { kind: EvidenceKind; text: string }
  fix: string
  verification: string
  risks: string[]
  incidentId?: string
}

export type KnowledgeEntry = {
  id: string
  title: string
  category: KnowledgeCategory
  projectId: string
  source: string
  updatedAt: string
  verification: Verification
  summary: string
  body: string[]
  history: { at: string; note: string; author: string }[]
}

export type IntegrationCard = {
  id: string
  name: string
  kind: string
  description: string
  capabilities: string[]
  state: 'not_connected'
  lastSync?: string
}

export type AutomationTask = {
  id: string
  name: string
  description: string
  projectId: string
  mode: AutomationMode
  trigger: string
  sources: string[]
  permission: string
  notify: string
  lastRun: string
  lastResult: string
}

export type LogLine = {
  id: string
  projectId: string
  at: string
  severity: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  service: string
  environment: Environment
  message: string
  traceId: string
}

export type Deployment = {
  id: string
  projectId: string
  sha: string
  branch: string
  environment: Environment
  startedAt: string
  finishedAt: string
  status: 'succeeded' | 'failed' | 'running'
}

export type HealthCheck = {
  id: string
  projectId: string
  name: string
  status: Health
  checkedAt: string
  reason: string
  history: Array<'up' | 'down' | 'degraded'>
}

export type FeedItem = {
  id: string
  projectId: string
  at: string
  kind: 'incident' | 'deployment' | 'pull_request' | 'tests' | 'report' | 'verification'
  title: string
  detail: string
  href: string
}

export type ActivityItem = {
  id: string
  projectId: string
  at: string
  state: ActivityState
  title: string
  detail: string
  href: string
}

export type DoctorSettings = {
  workspaceName: string
  timezone: string
  defaultEnv: Environment
  notifyEmail: boolean
  notifySlack: boolean
  approvalPolicy: 'owner' | 'oncall' | 'any_admin'
  allowPrDraft: boolean
  allowDeploy: boolean
  retentionDays: '7' | '30' | '90'
}
