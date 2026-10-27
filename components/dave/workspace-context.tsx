'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AUTOMATIONS, WORKSPACES } from '@/lib/dave/fixtures'
import type { AutomationMode, DoctorSettings, PreviewState, TimeRange } from '@/lib/dave/fixtures'

const STORAGE_KEY = 'dave-doctor-local-v1'

const DEFAULT_SETTINGS: DoctorSettings = {
  workspaceName: 'Northwind Engineering',
  timezone: 'UTC',
  defaultEnv: 'production',
  notifyEmail: true,
  notifySlack: false,
  approvalPolicy: 'oncall',
  allowPrDraft: true,
  allowDeploy: false,
  retentionDays: '30',
}

type Toast = { id: string; text: string }

export type McpServer = {
  id: string
  name: string
  url: string
  note: string
}

type Store = {
  userName: string
  companyName?: string
  workspaceId: string
  setWorkspaceId: (id: string) => void
  projectId: string
  setProjectId: (id: string) => void
  range: TimeRange
  setRange: (range: TimeRange) => void
  preview: PreviewState
  setPreview: (state: PreviewState) => void
  automation: Record<string, AutomationMode>
  setAutomation: (id: string, mode: AutomationMode) => void
  settings: DoctorSettings
  setSettings: (next: DoctorSettings) => void
  readNotes: string[]
  markNotesRead: () => void
  mcpServers: McpServer[]
  addMcpServer: (server: Omit<McpServer, 'id'>) => void
  removeMcpServer: (id: string) => void
  toasts: Toast[]
  pushToast: (text: string) => void
}

const Ctx = createContext<Store | null>(null)

function loadPersisted() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<Store>) : null
  } catch {
    return null
  }
}

export function DoctorWorkspaceProvider({
  userName,
  companyName,
  children,
}: {
  userName: string
  companyName?: string
  children: ReactNode
}) {
  const [workspaceId, setWorkspaceId] = useState('ws_northwind')
  const [projectId, setProjectId] = useState('all')
  const [range, setRange] = useState<TimeRange>('24h')
  const [preview] = useState<PreviewState>('ready')
  /** Demo stays live — preview states are locked to ready. */
  const setPreview = useCallback((_next: PreviewState) => {
    /* intentionally no-op: simulation demo always runs in ready mode */
  }, [])
  const [automation, setAutomationMap] = useState<Record<string, AutomationMode>>(() =>
    Object.fromEntries(AUTOMATIONS.map((task) => [task.id, task.mode])),
  )
  const [settings, setSettings] = useState<DoctorSettings>(DEFAULT_SETTINGS)
  const [readNotes, setReadNotes] = useState<string[]>([])
  const [mcpServers, setMcpServers] = useState<McpServer[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = loadPersisted()
    if (saved) {
      if (typeof saved.workspaceId === 'string' && WORKSPACES.some((ws) => ws.id === saved.workspaceId)) {
        setWorkspaceId(saved.workspaceId)
      }
      if (typeof saved.projectId === 'string') setProjectId(saved.projectId)
      if (saved.range) setRange(saved.range)
      if (saved.automation) setAutomationMap((prev) => ({ ...prev, ...saved.automation }))
      if (saved.settings) setSettings((prev) => ({ ...prev, ...saved.settings }))
      if (Array.isArray(saved.readNotes)) setReadNotes(saved.readNotes.filter((id) => typeof id === 'string'))
      if (Array.isArray(saved.mcpServers)) {
        setMcpServers(
          saved.mcpServers.filter(
            (item): item is McpServer =>
              Boolean(item) &&
              typeof item.id === 'string' &&
              typeof item.name === 'string' &&
              typeof item.url === 'string' &&
              typeof item.note === 'string',
          ),
        )
      }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const payload = { workspaceId, projectId, range, automation, settings, readNotes, mcpServers }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [ready, workspaceId, projectId, range, automation, settings, readNotes, mcpServers])

  const setAutomation = useCallback((id: string, mode: AutomationMode) => {
    setAutomationMap((prev) => ({ ...prev, [id]: mode }))
  }, [])

  const markNotesRead = useCallback(() => {
    setReadNotes(['nt_1', 'nt_2', 'nt_3', 'nt_4'])
  }, [])

  const addMcpServer = useCallback((server: Omit<McpServer, 'id'>) => {
    setMcpServers((prev) => [...prev, { ...server, id: `mcp_${Date.now().toString(36)}` }])
  }, [])

  const removeMcpServer = useCallback((id: string) => {
    setMcpServers((prev) => prev.filter((server) => server.id !== id))
  }, [])

  const pushToast = useCallback((text: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((prev) => [...prev, { id, text }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const value = useMemo<Store>(
    () => ({
      userName,
      companyName,
      workspaceId,
      setWorkspaceId: (id: string) => {
        setWorkspaceId(id)
        setProjectId('all')
      },
      projectId,
      setProjectId,
      range,
      setRange,
      preview,
      setPreview,
      automation,
      setAutomation,
      settings,
      setSettings,
      readNotes,
      markNotesRead,
      mcpServers,
      addMcpServer,
      removeMcpServer,
      toasts,
      pushToast,
    }),
    [
      userName,
      companyName,
      workspaceId,
      projectId,
      range,
      preview,
      automation,
      settings,
      readNotes,
      markNotesRead,
      mcpServers,
      addMcpServer,
      removeMcpServer,
      toasts,
      pushToast,
      setAutomation,
    ],
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="dv-toasts" aria-live="polite">
        {toasts.map((toast) => (
          <p key={toast.id} className="dv-toast" role="status">
            {toast.text}
          </p>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useDoctorWorkspace() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Doctor workspace is only available inside Dave Doctor.')
  return ctx
}
