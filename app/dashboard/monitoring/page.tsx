import { MonitoringPage } from '@/components/dave/pages/monitoring-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Monitoring' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <MonitoringPage />
}
