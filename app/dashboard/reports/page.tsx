import { ReportsPage } from '@/components/dave/pages/reports-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'AI Reports' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <ReportsPage />
}
