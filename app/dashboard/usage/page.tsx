import { UsagePage } from '@/components/dave/pages/usage-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Usage & Costs' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <UsagePage />
}
