'use client'

import { useState } from 'react'
import type { Key, Selection } from 'react-aria-components'
import {
  Activity,
  AlertTriangle,
  FileSearch,
  GitPullRequest,
  MemoryStick,
  Pause,
  Play,
  Power,
  ShieldCheck,
  Timer,
} from 'lucide-react'
import {
  Alert,
  AlertDialog,
  Button,
  Card,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from '@heroui/react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { AUTOMATIONS, projectById } from '@/lib/dave/fixtures'
import type { AutomationMode } from '@/lib/dave/fixtures'
import { formatStamp } from '@/lib/dave/format'
import { MotionIn } from '@/components/bizniz/motion-in'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { IconChip } from '@/components/dave/ui/icon-chip'
import { StateBlock } from '@/components/dave/ui/kit'

const ICONS = {
  auto_errors: { icon: AlertTriangle, tone: 'rose' as const },
  auto_investigate: { icon: FileSearch, tone: 'cyan' as const },
  auto_deploy: { icon: Activity, tone: 'sky' as const },
  auto_review: { icon: GitPullRequest, tone: 'violet' as const },
  auto_verify: { icon: ShieldCheck, tone: 'emerald' as const },
  auto_reports: { icon: Timer, tone: 'amber' as const },
  auto_memory: { icon: MemoryStick, tone: 'violet' as const },
}

function modeChip(mode: AutomationMode) {
  if (mode === 'enabled') return { color: 'success' as const, label: mode }
  if (mode === 'paused') return { color: 'warning' as const, label: mode }
  return { color: 'default' as const, label: mode }
}

export function AutomationPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId, automation, setAutomation, pushToast } = useDoctorWorkspace()
  const [pending, setPending] = useState<{ id: string; mode: AutomationMode; name: string } | null>(null)
  const rows = AUTOMATIONS.filter((task) => workspaceId === 'ws_northwind' && (projectId === 'all' || task.projectId === projectId))

  function ask(id: string, name: string, mode: AutomationMode) {
    if (mode === 'disabled') {
      setPending({ id, mode, name })
      return
    }
    setAutomation(id, mode)
    pushToast(`${name} is ${mode} on this screen only.`)
  }

  function onModeChange(id: string, name: string, keys: Selection) {
    if (keys === 'all') return
    const next = [...keys][0] as AutomationMode | undefined
    if (!next || next === (automation[id] ?? rows.find((row) => row.id === id)?.mode)) return
    ask(id, name, next)
  }

  return (
    <DoctorPage title={copy.pages.automation.title} subtitle={copy.pages.automation.sub}>
      <MotionIn>
        <Alert status="accent">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{lang === 'ar' ? 'معاينة محلية فقط' : 'Local preview only'}</Alert.Title>
            <Alert.Description>{copy.localOnly}</Alert.Description>
          </Alert.Content>
        </Alert>
      </MotionIn>
      {rows.length === 0 ? (
        <StateBlock title="No automations in this workspace" body="Connect a sample project by switching to Northwind Engineering. Toggles would still stay local." />
      ) : (
        <div className="dv-auto-grid">
          {rows.map((task, index) => {
            const mode = automation[task.id] ?? task.mode
            const meta = ICONS[task.id as keyof typeof ICONS] ?? { icon: Activity, tone: 'cyan' as const }
            const chip = modeChip(mode)
            const labels = {
              enabled: lang === 'ar' ? 'مفعّل' : 'Enabled',
              paused: lang === 'ar' ? 'موقوف' : 'Paused',
              disabled: lang === 'ar' ? 'معطّل' : 'Disabled',
            } as const
            return (
              <MotionIn key={task.id} delay={40 + index * 45}>
                <Card className="dv-hu-card w-full" variant="secondary">
                  <Card.Header className="flex flex-row items-start gap-3">
                    <IconChip icon={meta.icon} tone={meta.tone} />
                    <div className="min-w-0 flex-1">
                      <Card.Title className="text-[0.98rem] text-white">{task.name}</Card.Title>
                      <Card.Description className="text-[0.72rem] text-[#93a8c0]">
                        {projectById(task.projectId)?.name}
                      </Card.Description>
                    </div>
                    <Chip color={chip.color} variant="primary" size="sm">
                      {chip.label}
                    </Chip>
                  </Card.Header>
                  <Card.Content>
                    <p className="dv-auto-card__desc mb-3">{task.description}</p>
                    <dl className="dv-auto-meta">
                      <div>
                        <dt>Trigger</dt>
                        <dd>{task.trigger}</dd>
                      </div>
                      <div>
                        <dt>Sources</dt>
                        <dd>{task.sources.join(', ')}</dd>
                      </div>
                      <div>
                        <dt>Permission</dt>
                        <dd>{task.permission}</dd>
                      </div>
                      <div>
                        <dt>Notify</dt>
                        <dd>{task.notify}</dd>
                      </div>
                      <div>
                        <dt>Last run</dt>
                        <dd>
                          <time dateTime={task.lastRun}>{formatStamp(task.lastRun)}</time>
                        </dd>
                      </div>
                      <div>
                        <dt>Result</dt>
                        <dd>{task.lastResult}</dd>
                      </div>
                    </dl>
                  </Card.Content>
                  <Card.Footer className="dv-hu-seg">
                    <ToggleButtonGroup
                      aria-label={`${task.name} state`}
                      selectionMode="single"
                      selectedKeys={new Set<Key>([mode])}
                      onSelectionChange={(keys) => onModeChange(task.id, task.name, keys)}
                      size="sm"
                      fullWidth
                    >
                      <ToggleButton id="enabled">
                        <Play size={14} strokeWidth={2} />
                        {labels.enabled}
                      </ToggleButton>
                      <ToggleButton id="paused">
                        <ToggleButtonGroup.Separator />
                        <Pause size={14} strokeWidth={2} />
                        {labels.paused}
                      </ToggleButton>
                      <ToggleButton id="disabled">
                        <ToggleButtonGroup.Separator />
                        <Power size={14} strokeWidth={2} />
                        {labels.disabled}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Card.Footer>
                </Card>
              </MotionIn>
            )
          })}
        </div>
      )}

      <AlertDialog.Backdrop
        isOpen={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[420px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="warning" />
              <AlertDialog.Heading>Disable this automation?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Disabling only changes the sample switch in this browser. It does not stop a worker,
                because no worker is running.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button
                variant="danger"
                onPress={() => {
                  if (pending) {
                    setAutomation(pending.id, pending.mode)
                    pushToast(`${pending.name} disabled on this screen only.`)
                  }
                  setPending(null)
                }}
              >
                Disable on this screen
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </DoctorPage>
  )
}
