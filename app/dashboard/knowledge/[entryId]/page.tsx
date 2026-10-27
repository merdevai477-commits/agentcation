import { KnowledgeDetailPage } from '@/components/dave/pages/knowledge-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Knowledge' }

export default async function Page({ params }: { params: Promise<{ entryId: string }> }) {
  await requireProductPath('dave_doctor')
  const { entryId } = await params
  return <KnowledgeDetailPage entryId={entryId} />
}
