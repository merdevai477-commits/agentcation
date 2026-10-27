'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  Gauge,
  Info,
  Languages,
  Plug,
  Settings2,
  Shield,
  SlidersHorizontal,
  Stethoscope,
  UserRound,
  Bell,
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { Button, Chip, Label, Modal, Separator, Switch, Tabs } from '@heroui/react'
import { daveCopy } from '@/lib/dave/copy'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { NOTIFICATIONS } from '@/lib/dave/fixtures'
import { formatStamp } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorSelect } from '@/components/dave/ui/kit'

export function NotificationButton() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { readNotes, markNotesRead } = useDoctorWorkspace()
  const unread = NOTIFICATIONS.filter((note) => !readNotes.includes(note.id))

  return (
    <Modal>
      <Button
        isIconOnly
        aria-label={copy.notifications}
        className="dv-hu-icon-btn relative"
        size="sm"
        variant="secondary"
      >
        <Bell size={15} strokeWidth={1.85} />
        {unread.length > 0 ? <span className="dv-count">{unread.length}</span> : null}
      </Button>
      <Modal.Backdrop variant="blur" className="dv-hu-modal-backdrop">
        <Modal.Container placement="center">
          <Modal.Dialog className="dv-hu-glass-modal sm:max-w-[420px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="dv-hu-modal-icon">
                <Bell size={18} strokeWidth={1.85} />
              </Modal.Icon>
              <Modal.Heading>{copy.notifications}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="pt-1">
              {NOTIFICATIONS.length === 0 ? (
                <p className="dv-menu__empty">{copy.noneNotes}</p>
              ) : (
                <ul className="dv-hu-note-list">
                  {NOTIFICATIONS.map((note) => (
                    <li key={note.id}>
                      <a href={note.href} className="dv-hu-note">
                        <span>{note.title}</span>
                        <small>{note.body}</small>
                        <time dateTime={note.at}>{formatStamp(note.at)}</time>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" size="sm" variant="tertiary">
                {copy.close}
              </Button>
              <Button size="sm" variant="secondary" onPress={markNotesRead}>
                <Check size={13} />
                {copy.markRead}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

type IconTone = 'slate' | 'amber' | 'cyan' | 'sky' | 'violet' | 'emerald' | 'rose'

function ProfileAction({
  icon: Icon,
  title,
  hint,
  tone,
  onPress,
}: {
  icon: typeof Settings2
  title: string
  hint: string
  tone: IconTone
  onPress: () => void
}) {
  return (
    <button type="button" className="dv-profile-action" onClick={onPress}>
      <span className={`dv-profile-action__icon dv-profile-action__icon--${tone}`} aria-hidden>
        <Icon size={16} strokeWidth={1.85} />
      </span>
      <span className="dv-profile-action__copy">
        <strong>{title}</strong>
        <small>{hint}</small>
      </span>
      <ChevronRight size={15} className="dv-profile-action__chev" aria-hidden />
    </button>
  )
}

export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const { lang, toggle } = useBiznizLang()
  const t = daveCopy(lang)
  const copy = doctorCopy(lang)
  const { userName, companyName, settings, setSettings, pushToast, workspaceId } = useDoctorWorkspace()
  const [open, setOpen] = useState(false)
  const initial = userName.trim().charAt(0).toUpperCase() || 'D'
  const workspaceLabel = workspaceId === 'ws_sandbox' ? 'Sandbox' : settings.workspaceName || 'Northwind Engineering'

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      {compact ? (
        <button
          type="button"
          className="dv-user-chip dv-user-chip--panel"
          aria-label={copy.account}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="dv-avatar">{initial}</span>
          <span className="min-w-0 flex-1 text-start">
            <span className="block truncate text-sm font-medium text-white">{userName}</span>
            <span className="block truncate text-[11px] text-neutral-500">
              {companyName || copy.account}
            </span>
          </span>
          <ChevronRight size={14} className="opacity-45 shrink-0" aria-hidden />
        </button>
      ) : (
        <Button
          isIconOnly
          aria-label={copy.account}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="dv-hu-icon-btn"
          size="sm"
          variant="secondary"
          onPress={() => setOpen(true)}
        >
          <UserRound size={15} strokeWidth={1.85} />
        </Button>
      )}

      <Modal.Backdrop
        isOpen={open}
        onOpenChange={setOpen}
        variant="blur"
        className="dv-hu-modal-backdrop"
      >
        <Modal.Container placement="center">
          <Modal.Dialog className="dv-hu-glass-modal dv-hu-profile-modal sm:max-w-[480px]">
            <span className="dv-hu-glass-modal__orb" aria-hidden />
            <span className="dv-hu-glass-modal__shine" aria-hidden />
            <span className="dv-hu-glass-modal__rim" aria-hidden />
            <Modal.CloseTrigger />

            <Modal.Body className="dv-profile-body">
              <div className="dv-profile-hero">
                <span className="dv-profile-hero__avatar" aria-hidden>
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="dv-profile-hero__row">
                    <h2 className="dv-profile-hero__name">{userName}</h2>
                    <Chip size="sm" variant="soft">
                      {copy.sample}
                    </Chip>
                  </div>
                  <p className="dv-profile-hero__meta">
                    {companyName || copy.account}
                    <span aria-hidden>·</span>
                    {workspaceLabel}
                  </p>
                </div>
              </div>

              <p className="dv-profile-note">
                <Info size={13} strokeWidth={2} aria-hidden />
                <span>{copy.localOnly}</span>
              </p>

              <Tabs className="dv-profile-tabs w-full" defaultSelectedKey="profile">
                <Tabs.ListContainer>
                  <Tabs.List aria-label={copy.account}>
                    <Tabs.Tab id="profile">
                      <span className="dv-profile-tab-ico dv-profile-tab-ico--sky">
                        <UserRound size={13} strokeWidth={2} />
                      </span>
                      {lang === 'ar' ? 'الحساب' : 'Profile'}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="prefs">
                      <span className="dv-profile-tab-ico dv-profile-tab-ico--violet">
                        <SlidersHorizontal size={13} strokeWidth={2} />
                      </span>
                      {lang === 'ar' ? 'التفضيلات' : 'Preferences'}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="access">
                      <span className="dv-profile-tab-ico dv-profile-tab-ico--emerald">
                        <Shield size={13} strokeWidth={2} />
                      </span>
                      {lang === 'ar' ? 'الوصول' : 'Access'}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel id="profile" className="dv-profile-panel">
                  <div className="dv-profile-list">
                    <ProfileAction
                      icon={Settings2}
                      tone="slate"
                      title={copy.links.settings}
                      hint={lang === 'ar' ? 'تفضيلات مساحة العمل كاملة' : 'Full workspace preferences'}
                      onPress={() => go('/dashboard/preferences')}
                    />
                    <ProfileAction
                      icon={ClipboardCheck}
                      tone="amber"
                      title={copy.links.approvals}
                      hint={lang === 'ar' ? 'موافقات الإصلاح المقترح' : 'Proposed fix approvals'}
                      onPress={() => go('/dashboard/approvals')}
                    />
                    <ProfileAction
                      icon={Stethoscope}
                      tone="cyan"
                      title={copy.links.replay}
                      hint={lang === 'ar' ? 'محاكاة تحقيق محلية' : 'Local investigation simulation'}
                      onPress={() => go('/dashboard/investigate')}
                    />
                    <ProfileAction
                      icon={BookOpen}
                      tone="sky"
                      title={copy.links.docs}
                      hint={lang === 'ar' ? 'دليل Dave Doctor' : 'Dave Doctor product guide'}
                      onPress={() => go('/docs/meet-dave-doctor')}
                    />
                    <ProfileAction
                      icon={Plug}
                      tone="violet"
                      title={lang === 'ar' ? 'التكاملات' : 'Integrations'}
                      hint={lang === 'ar' ? 'مزوّدون و MCP محلي' : 'Providers and local MCP'}
                      onPress={() => go('/dashboard/integrations')}
                    />
                    <ProfileAction
                      icon={Gauge}
                      tone="emerald"
                      title={lang === 'ar' ? 'الاستخدام' : 'Usage'}
                      hint={lang === 'ar' ? 'أرقام عينة للاستهلاك' : 'Sample consumption numbers'}
                      onPress={() => go('/dashboard/usage')}
                    />
                  </div>
                </Tabs.Panel>

              <Tabs.Panel id="prefs" className="dv-profile-panel">
                <div className="dv-profile-prefs">
                  <div className="dv-profile-pref">
                    <div className="dv-profile-pref__head">
                      <span className="dv-profile-action__icon dv-profile-action__icon--sky" aria-hidden>
                        <Languages size={15} strokeWidth={1.85} />
                      </span>
                      <div>
                        <strong>{lang === 'ar' ? 'اللغة' : 'Language'}</strong>
                        <small>{lang === 'ar' ? 'تبديل واجهة Dave Doctor' : 'Switch Dave Doctor UI language'}</small>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onPress={toggle}>
                      <Languages size={14} />
                      {t.langToggle}
                    </Button>
                  </div>

                  <Separator />

                  <div className="dv-profile-switches">
                    <Switch
                      isSelected={settings.notifyEmail}
                      onChange={(notifyEmail) => {
                        setSettings({ ...settings, notifyEmail })
                        pushToast(lang === 'ar' ? 'تم تحديث تفضيل البريد محليًا' : 'Email preference updated locally')
                      }}
                    >
                      <Switch.Content>
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                        <span className="dv-profile-switch-label">
                          <strong>{lang === 'ar' ? 'ملخص البريد' : 'Email digest'}</strong>
                          <small>{lang === 'ar' ? 'الوجهة غير متصلة' : 'Destination not connected'}</small>
                        </span>
                      </Switch.Content>
                    </Switch>
                    <Switch
                      isSelected={settings.notifySlack}
                      onChange={(notifySlack) => {
                        setSettings({ ...settings, notifySlack })
                        pushToast(lang === 'ar' ? 'تم تحديث تفضيل Slack محليًا' : 'Slack preference updated locally')
                      }}
                    >
                      <Switch.Content>
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                        <span className="dv-profile-switch-label">
                          <strong>{lang === 'ar' ? 'تنبيهات Slack' : 'Slack alerts'}</strong>
                          <small>{lang === 'ar' ? 'التكامل غير متصل' : 'Integration not connected'}</small>
                        </span>
                      </Switch.Content>
                    </Switch>
                  </div>

                  <DoctorSelect
                    label={lang === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}
                    value={settings.timezone}
                    fullWidth
                    className="dv-hu-select--menu"
                    onChange={(timezone) => {
                      setSettings({ ...settings, timezone })
                      pushToast(lang === 'ar' ? 'تم حفظ المنطقة الزمنية محليًا' : 'Timezone saved locally')
                    }}
                    options={[
                      { value: 'UTC', label: 'UTC' },
                      { value: 'Africa/Cairo', label: 'Africa/Cairo' },
                      { value: 'America/New_York', label: 'America/New_York' },
                    ]}
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel id="access" className="dv-profile-panel">
                <div className="dv-profile-access">
                  <div className="dv-profile-access__card">
                    <span className="dv-profile-action__icon dv-profile-action__icon--emerald" aria-hidden>
                      <Shield size={16} strokeWidth={1.85} />
                    </span>
                    <div>
                      <strong>{lang === 'ar' ? 'سياسة الموافقة' : 'Approval policy'}</strong>
                      <small>
                        {settings.approvalPolicy === 'owner'
                          ? lang === 'ar'
                            ? 'مالك المساحة فقط'
                            : 'Workspace owner only'
                          : settings.approvalPolicy === 'oncall'
                            ? lang === 'ar'
                              ? 'المناوب + المالك'
                              : 'On-call plus owner'
                            : lang === 'ar'
                              ? 'أي مسؤول'
                              : 'Any admin'}
                      </small>
                    </div>
                  </div>
                  <div className="dv-profile-access__card">
                    <span className="dv-profile-action__icon dv-profile-action__icon--cyan" aria-hidden>
                      <Stethoscope size={16} strokeWidth={1.85} />
                    </span>
                    <div>
                      <strong>{lang === 'ar' ? 'صلاحيات المهام' : 'Task permissions'}</strong>
                      <small>
                        {lang === 'ar'
                          ? `مسودة PR: ${settings.allowPrDraft ? 'مسموح' : 'موقوف'} · نشر: ${settings.allowDeploy ? 'مسموح' : 'موقوف'}`
                          : `PR draft: ${settings.allowPrDraft ? 'on' : 'off'} · Deploy: ${settings.allowDeploy ? 'on' : 'off'}`}
                      </small>
                    </div>
                  </div>

                  <div className="dv-profile-clerk">
                    <div>
                      <Label>{lang === 'ar' ? 'إدارة جلسة Clerk' : 'Clerk session'}</Label>
                      <p className="dv-menu__hint mb-0">
                        {lang === 'ar'
                          ? 'تسجيل الخروج وإدارة الهوية من هنا.'
                          : 'Sign out and manage identity from here.'}
                      </p>
                    </div>
                    <UserButton />
                  </div>

                  <Button
                    className="w-full justify-start"
                    size="sm"
                    variant="secondary"
                    onPress={() => go('/dashboard/preferences')}
                  >
                    <Settings2 size={15} />
                    {lang === 'ar' ? 'فتح صفحة الإعدادات كاملة' : 'Open full settings page'}
                    <ChevronRight size={14} className="ms-auto opacity-60" />
                  </Button>
                </div>
                </Tabs.Panel>
              </Tabs>
            </Modal.Body>

            <Modal.Footer className="dv-profile-footer">
              <Button size="sm" variant="ghost" onPress={() => setOpen(false)}>
                {copy.close}
              </Button>
              <Button size="sm" variant="primary" onPress={() => go('/dashboard/preferences')}>
                <Settings2 size={14} />
                {copy.links.settings}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  )
}
