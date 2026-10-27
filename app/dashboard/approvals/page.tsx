import { DaveApprovalsPage } from '@/components/dave/approvals-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Approvals' }

export default async function ApprovalsRoute() {
  await requireProductPath('dave_doctor')
  return <DaveApprovalsPage />
}
