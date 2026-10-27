import { PullDetailPage } from '@/components/dave/pages/code-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Pull request' }

export default async function Page({ params }: { params: Promise<{ pullId: string }> }) {
  await requireProductPath('dave_doctor')
  const { pullId } = await params
  return <PullDetailPage pullId={pullId} />
}
