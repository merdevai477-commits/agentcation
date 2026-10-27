import { AutomationPage } from '@/components/dave/pages/automation-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'AI Tasks & Automation' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <AutomationPage />
}
