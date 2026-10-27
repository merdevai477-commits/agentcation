'use client'

import { useState } from 'react'
import { Alert, Button, Card, Chip, Input, Label, TextField } from '@heroui/react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { INTEGRATIONS } from '@/lib/dave/fixtures'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { Modal, SampleTag } from '@/components/dave/ui/kit'

const MARK: Record<string, string> = {
  int_github: 'GH',
  int_railway: 'RW',
  int_slack: 'SL',
  int_linear: 'LN',
  int_sentry: 'SE',
  int_datadog: 'DD',
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function IntegrationsPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const mcp = copy.mcp
  const { mcpServers, addMcpServer, removeMcpServer, pushToast } = useDoctorWorkspace()
  const [openId, setOpenId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const selected = INTEGRATIONS.find((item) => item.id === openId)

  function addServer() {
    const nextName = name.trim()
    const nextUrl = url.trim()
    if (!nextName || !isHttpUrl(nextUrl)) {
      setError(mcp.invalid)
      return
    }
    addMcpServer({ name: nextName, url: nextUrl, note: note.trim() })
    setName('')
    setUrl('')
    setNote('')
    setError('')
    pushToast(mcp.added)
  }

  return (
    <DoctorPage title={copy.pages.integrations.title} subtitle={copy.pages.integrations.sub}>
      <Card className="dv-hu-card dv-hu-panel w-full" variant="secondary">
        <Card.Header className="flex flex-row items-start justify-between gap-3">
          <div>
            <Card.Title>{mcp.title}</Card.Title>
            <Card.Description>{mcp.body}</Card.Description>
          </div>
          <SampleTag />
        </Card.Header>
        <Card.Content>
          <form
            className="dv-mcp-form"
            onSubmit={(event) => {
              event.preventDefault()
              addServer()
            }}
          >
            <TextField name="mcp-name" value={name} onChange={setName}>
              <Label>{mcp.name}</Label>
              <Input placeholder="Internal logs" />
            </TextField>
            <TextField name="mcp-url" value={url} onChange={setUrl}>
              <Label>{mcp.url}</Label>
              <Input placeholder="https://mcp.internal/sse" inputMode="url" />
            </TextField>
            <TextField name="mcp-note" value={note} onChange={setNote}>
              <Label>{mcp.note}</Label>
              <Input placeholder="Deploy logs, private metrics" />
            </TextField>
            <Button type="submit" variant="primary">
              {mcp.add}
            </Button>
          </form>
          {error ? (
            <Alert status="danger" className="mt-3 mb-0">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{error}</Alert.Title>
              </Alert.Content>
            </Alert>
          ) : (
            <p className="dv-form-hint">{mcp.hint}</p>
          )}
          {mcpServers.length === 0 ? (
            <p className="dv-form-hint">{mcp.empty}</p>
          ) : (
            <ul className="dv-int-list">
              {mcpServers.map((server) => (
                <li key={server.id} className="dv-int-row">
                  <span className="dv-int-mark" aria-hidden>
                    MCP
                  </span>
                  <div className="dv-int-copy">
                    <strong>{server.name}</strong>
                    <span className="dv-mono">{server.url}</span>
                    {server.note ? <span>{server.note}</span> : null}
                  </div>
                  <Chip size="sm" variant="soft">
                    {lang === 'ar' ? 'محلي' : 'Local only'}
                  </Chip>
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => {
                      removeMcpServer(server.id)
                      pushToast(mcp.removed)
                    }}
                  >
                    {mcp.remove}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card.Content>
      </Card>

      <Card className="dv-hu-card dv-hu-panel w-full" variant="secondary">
        <Card.Header>
          <Card.Title>{lang === 'ar' ? 'دليل المزوّدين' : 'Provider catalog'}</Card.Title>
          <Card.Description>
            {lang === 'ar' ? 'لا يوجد مزوّد متصل. الزر يفتح معاينة فقط.' : 'No provider is connected. A button only opens a preview.'}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <ul className="dv-int-list">
            {INTEGRATIONS.map((item) => (
              <li key={item.id} className="dv-int-row">
                <span className="dv-int-mark" aria-hidden>
                  {MARK[item.id]}
                </span>
                <div className="dv-int-copy">
                  <strong>
                    {item.name}
                    <span>{item.kind}</span>
                  </strong>
                  <span>{item.description}</span>
                  <span>{item.capabilities.join(' · ')}</span>
                </div>
                <Chip color="danger" size="sm" variant="soft">
                  {lang === 'ar' ? 'غير متصل' : 'Not connected'}
                </Chip>
                <Button size="sm" variant="secondary" onPress={() => setOpenId(item.id)}>
                  {item.id === 'int_datadog' ? (lang === 'ar' ? 'إعداد' : 'Configure') : lang === 'ar' ? 'ربط' : 'Connect'}
                </Button>
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>

      <Modal open={Boolean(selected)} title={selected ? selected.name : ''} onClose={() => setOpenId(null)}>
        <Alert status="warning" className="mb-3">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{copy.backend}</Alert.Description>
          </Alert.Content>
        </Alert>
        <p className="dv-prose">
          {selected?.name} stays not connected. This dialog does not request credentials.
        </p>
      </Modal>
    </DoctorPage>
  )
}
