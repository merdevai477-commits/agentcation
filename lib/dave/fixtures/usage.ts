/** Sample usage figures. These are not invoices or metered bills. */

export const USAGE_TOTALS = {
  investigations: 18,
  taskRuns: 42,
  inputTokens: 1_840_000,
  outputTokens: 260_000,
  sampleCost: 12.4,
  limitInvestigations: 100,
  limitTokens: 5_000_000,
  limitCost: 50,
}

export const USAGE_BY_PROJECT = [
  { projectId: 'prj_checkout', investigations: 9, tokens: 980_000, sampleCost: 6.1 },
  { projectId: 'prj_auth', investigations: 4, tokens: 420_000, sampleCost: 2.4 },
  { projectId: 'prj_billing', investigations: 3, tokens: 510_000, sampleCost: 2.9 },
  { projectId: 'prj_docs', investigations: 2, tokens: 190_000, sampleCost: 1.0 },
]

export const USAGE_BY_TYPE = [
  { type: 'log_investigation', runs: 11, tokens: 380_000 },
  { type: 'memory_investigation', runs: 4, tokens: 290_000 },
  { type: 'code_analysis', runs: 8, tokens: 640_000 },
  { type: 'pr_review', runs: 6, tokens: 310_000 },
  { type: 'test_execution', runs: 3, tokens: 40_000 },
  { type: 'deployment_verification', runs: 5, tokens: 180_000 },
  { type: 'architecture_analysis', runs: 2, tokens: 160_000 },
  { type: 'knowledge_update', runs: 3, tokens: 100_000 },
]

export const USAGE_OVER_TIME = [8, 10, 9, 14, 12, 18, 16, 22, 19, 24, 21, 28, 26, 30]
