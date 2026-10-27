import { SettingsPage } from '@/components/dave/pages/settings-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Settings' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <SettingsPage />
}
