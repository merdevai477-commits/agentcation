'use client'

import { useEffect, useState } from 'react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import type { DoctorSettings } from '@/lib/dave/fixtures'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { ConfirmDialog, Panel, SelectField, TabBar } from '@/components/dave/ui/kit'

type Section =
  | 'workspace'
  | 'defaults'
  | 'notifications'
  | 'approval'
  | 'permissions'
  | 'retention'
  | 'team'
  | 'security'

const AUDIT = [
  { at: '21 Oct 2026 14:39', actor: 'Sample on-call', event: 'Viewed PR #482. No approval recorded.' },
  { at: '21 Oct 2026 09:02', actor: 'Sample on-call', event: 'Approved staging patch for billing RSS. Production deploy remains off.' },
  { at: '21 Oct 2026 07:04', actor: 'Dave Doctor', event: 'Stopped at signing-key rotation. Secret changes are not permitted.' },
  { at: '18 Oct 2026 17:20', actor: 'Sample deployer', event: 'dpl_160 applied. Later verification failed and the incident reopened.' },
]

export function SettingsPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { settings, setSettings, pushToast, userName } = useDoctorWorkspace()
  const [section, setSection] = useState<Section>('workspace')
  const [draft, setDraft] = useState<DoctorSettings>(settings)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    setDraft(settings)
  }, [settings])

  function patch(partial: Partial<DoctorSettings>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  return (
    <DoctorPage title={copy.pages.settings.title} subtitle={copy.pages.settings.sub}>
      <p className="dv-callout dv-callout--info">{copy.localOnly}</p>
      <TabBar
        label="Settings sections"
        value={section}
        onChange={setSection}
        tabs={[
          { id: 'workspace', label: 'Workspace' },
          { id: 'defaults', label: 'Project defaults' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'approval', label: 'Approval policies' },
          { id: 'permissions', label: 'AI task permissions' },
          { id: 'retention', label: 'Data retention' },
          { id: 'team', label: 'Team access' },
          { id: 'security', label: 'Security & audit' },
        ]}
      />
      {section === 'workspace' ? (
        <Panel title="Workspace settings">
          <label className="dv-search">
            Display name
            <input className="dv-field" value={draft.workspaceName} onChange={(event) => patch({ workspaceName: event.target.value })} />
          </label>
          <div className="mt-3">
            <SelectField
              label="Timezone"
              value={draft.timezone}
              onChange={(timezone) => patch({ timezone })}
              options={[
                { value: 'UTC', label: 'UTC' },
                { value: 'Africa/Cairo', label: 'Africa/Cairo' },
                { value: 'America/New_York', label: 'America/New_York' },
              ]}
            />
          </div>
        </Panel>
      ) : null}
      {section === 'defaults' ? (
        <Panel title="Project defaults">
          <SelectField
            label="Default environment for new sample projects"
            value={draft.defaultEnv}
            onChange={(defaultEnv) => patch({ defaultEnv: defaultEnv as DoctorSettings['defaultEnv'] })}
            options={[
              { value: 'production', label: 'Production' },
              { value: 'staging', label: 'Staging' },
              { value: 'preview', label: 'Preview' },
            ]}
          />
        </Panel>
      ) : null}
      {section === 'notifications' ? (
        <Panel title="Notifications">
          <label className="dv-check">
            <input type="checkbox" checked={draft.notifyEmail} onChange={(event) => patch({ notifyEmail: event.target.checked })} />
            Email digest (destination not connected)
          </label>
          <label className="dv-check mt-2">
            <input type="checkbox" checked={draft.notifySlack} onChange={(event) => patch({ notifySlack: event.target.checked })} />
            Slack channel (integration is not connected)
          </label>
        </Panel>
      ) : null}
      {section === 'approval' ? (
        <Panel title="Approval policies">
          <SelectField
            label="Who may approve a proposed fix"
            value={draft.approvalPolicy}
            onChange={(approvalPolicy) => patch({ approvalPolicy: approvalPolicy as DoctorSettings['approvalPolicy'] })}
            options={[
              { value: 'owner', label: 'Workspace owner only' },
              { value: 'oncall', label: 'On-call plus owner' },
              { value: 'any_admin', label: 'Any admin' },
            ]}
          />
          <p className="dv-prose mt-3">Policy is stored locally. It does not grant deploy rights.</p>
        </Panel>
      ) : null}
      {section === 'permissions' ? (
        <Panel title="AI task permissions">
          <label className="dv-check">
            <input type="checkbox" checked={draft.allowPrDraft} onChange={(event) => patch({ allowPrDraft: event.target.checked })} />
            Allow preparing a draft pull request after a person asks
          </label>
          <label className="dv-check mt-2">
            <input type="checkbox" checked={draft.allowDeploy} onChange={(event) => patch({ allowDeploy: event.target.checked })} />
            Allow production deploys (stays off in this sample; deploys are not implemented)
          </label>
        </Panel>
      ) : null}
      {section === 'retention' ? (
        <Panel title="Data retention">
          <SelectField
            label="How long sample evidence is kept"
            value={draft.retentionDays}
            onChange={(retentionDays) => patch({ retentionDays: retentionDays as DoctorSettings['retentionDays'] })}
            options={[
              { value: '7', label: '7 days' },
              { value: '30', label: '30 days' },
              { value: '90', label: '90 days' },
            ]}
          />
          <p className="dv-prose mt-3">Nothing is deleted, because evidence is not stored on a server from this UI.</p>
        </Panel>
      ) : null}
      {section === 'team' ? (
        <Panel title="Team access">
          <div className="dv-table-wrap">
            <table className="dv-table">
              <caption>Sample members. Invites are not sent.</caption>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Can approve</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Person">{userName}</td>
                  <td data-label="Role">Owner</td>
                  <td data-label="Can approve">Yes</td>
                </tr>
                <tr>
                  <td data-label="Person">Sample on-call</td>
                  <td data-label="Role">Responder</td>
                  <td data-label="Can approve">When policy allows</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="dv-btn dv-btn--ghost mt-3"
            onClick={() => pushToast('Invites are not implemented. No message was sent.')}
          >
            Invite teammate
          </button>
        </Panel>
      ) : null}
      {section === 'security' ? (
        <Panel title="Security and audit history">
          <p className="dv-prose mb-3">Sample audit rows. They are not read from an auth or audit service.</p>
          <ul className="dv-stack">
            {AUDIT.map((row) => (
              <li key={row.event} className="text-sm text-slate-300">
                <span className="text-slate-500">{row.at}</span> · {row.actor} — {row.event}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
      {section !== 'team' && section !== 'security' ? (
        <button type="button" className="dv-btn dv-btn--primary mt-4" onClick={() => setConfirm(true)}>
          {copy.save}
        </button>
      ) : null}
      <ConfirmDialog
        open={confirm}
        title="Save settings in this browser?"
        body="Dave Doctor will keep these choices in the current browser session. They do not change authentication, providers, or running tasks."
        confirmLabel={copy.save}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setSettings(draft)
          setConfirm(false)
          pushToast(copy.saved)
        }}
      />
    </DoctorPage>
  )
}
