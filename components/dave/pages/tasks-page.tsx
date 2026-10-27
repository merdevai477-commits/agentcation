'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { incidentById, projectById, taskById, TASKS } from '@/lib/dave/fixtures'
import { formatStamp, includesQuery } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { Badge, EvidenceTag, MissingRecord, Panel, SearchField, SelectField, StateBlock } from '@/components/dave/ui/kit'

export function TasksPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId } = useDoctorWorkspace()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const rows = useMemo(() => {
    return TASKS.filter(() => workspaceId === 'ws_northwind')
      .filter((task) => projectId === 'all' || task.projectId === projectId)
      .filter((task) => type === 'all' || task.type === type)
      .filter((task) => status === 'all' || task.status === status)
      .filter((task) => includesQuery(query, [task.title, task.result, projectById(task.projectId)?.name]))
  }, [workspaceId, projectId, query, type, status])

  return (
    <DoctorPage title={copy.pages.tasks.title} subtitle={copy.pages.tasks.sub}>
      <p className="dv-callout dv-callout--info">
        Completed means the task finished its own objective. Verification tells you whether the underlying issue was shown to be fixed.
      </p>
      <div className="dv-filters">
        <SearchField value={query} onChange={setQuery} placeholder="Task or project" />
        <SelectField
          label="Type"
          value={type}
          onChange={setType}
          options={[{ value: 'all', label: 'All types' }, ...Object.entries(copy.taskType).map(([value, label]) => ({ value, label }))]}
        />
        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[{ value: 'all', label: 'All statuses' }, ...Object.entries(copy.taskStatus).map(([value, label]) => ({ value, label }))]}
        />
      </div>
      {rows.length === 0 ? (
        <StateBlock title="No tasks" body="No sample task matches this workspace or filter." />
      ) : (
        <div className="dv-table-wrap">
          <table className="dv-table">
            <caption>Sample engineering tasks.</caption>
            <thead>
              <tr>
                <th>Task</th>
                <th>Type</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Incident</th>
                <th>Result</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((task) => (
                <tr key={task.id}>
                  <td data-label="Task">
                    <Link href={`/dashboard/tasks/${task.id}`}>{task.title}</Link>
                  </td>
                  <td data-label="Type">{copy.taskType[task.type]}</td>
                  <td data-label="Project">{projectById(task.projectId)?.name}</td>
                  <td data-label="Status">
                    <Badge tone={task.status === 'failed' ? 'bad' : task.status === 'completed' ? 'ok' : 'warn'}>{copy.taskStatus[task.status]}</Badge>
                  </td>
                  <td data-label="Priority">{task.priority.toUpperCase()}</td>
                  <td data-label="Created">{formatStamp(task.createdAt)}</td>
                  <td data-label="Incident">
                    {task.incidentId ? (
                      <Link className="dv-link" href={`/dashboard/incidents/${task.incidentId}`}>
                        {incidentById(task.incidentId)?.title ?? task.incidentId}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td data-label="Result">{task.result}</td>
                  <td data-label="Verification">{copy.verify[task.verification]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DoctorPage>
  )
}

export function TaskDetailPage({ taskId }: { taskId: string }) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId } = useDoctorWorkspace()
  const task = taskById(taskId)
  if (!task || workspaceId !== 'ws_northwind') {
    return (
      <DoctorPage title="Task" subtitle="Sample record">
        <MissingRecord href="/dashboard/tasks" label="Back to tasks" />
      </DoctorPage>
    )
  }
  const finished = task.status === 'completed' || task.status === 'failed'
  const verified = task.verification === 'passed'
  return (
    <DoctorPage
      title={task.title}
      subtitle={`${copy.taskType[task.type]} · ${projectById(task.projectId)?.name}`}
      actions={
        <Link href="/dashboard/tasks" className="dv-btn dv-btn--ghost">
          All tasks
        </Link>
      }
    >
      <p className={verified ? 'dv-callout dv-callout--info' : 'dv-callout dv-callout--warn'}>
        {finished ? `Task status: ${copy.taskStatus[task.status]}. ` : 'This task is not finished. '}
        Verification: {copy.verify[task.verification]}.
        {finished && !verified ? ' Finishing the task did not verify the incident.' : ''}
      </p>
      <div className="dv-stack">
        <Panel title="Objective">
          <p className="dv-prose">{task.objective}</p>
        </Panel>
        <Panel title="Execution timeline">
          <ol className="dv-timeline">
            {task.timeline.map((event) => (
              <li key={event.title}>
                <time dateTime={event.at}>{formatStamp(event.at)}</time>
                <strong>{event.title}</strong>
                <p>{event.detail}</p>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Evidence collected">
          {task.evidence.length === 0 ? <p className="dv-prose">No evidence recorded.</p> : null}
          <ul className="dv-stack">
            {task.evidence.map((item) => (
              <li key={item.text}>
                <EvidenceTag kind={item.kind} /> <span className="text-sm text-slate-300">{item.source}: {item.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Actions performed">
          <ul className="list-disc ps-5 text-sm text-slate-300">
            {task.actions.length === 0 ? <li>None yet.</li> : task.actions.map((action) => <li key={action}>{action}</li>)}
          </ul>
        </Panel>
        <Panel title="Results">
          <p className="dv-prose">{task.result}</p>
        </Panel>
        <Panel title="Errors">
          {task.errors.length === 0 ? <p className="dv-prose">No errors recorded for this task.</p> : null}
          <ul className="list-disc ps-5 text-sm text-rose-200">
            {task.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="Approval history">
          {task.approvals.length === 0 ? <p className="dv-prose">No approval was requested.</p> : null}
          <ul className="dv-stack">
            {task.approvals.map((approval) => (
              <li key={approval.at} className="text-sm text-slate-300">
                {formatStamp(approval.at)} · {approval.actor} · {approval.decision}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Final outcome">
          <p className="dv-prose">{task.outcome}</p>
          {task.incidentId ? (
            <Link className="dv-link" href={`/dashboard/incidents/${task.incidentId}`}>
              Related incident
            </Link>
          ) : null}
        </Panel>
      </div>
    </DoctorPage>
  )
}
