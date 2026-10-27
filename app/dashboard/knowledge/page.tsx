import { KnowledgePage } from '@/components/dave/pages/knowledge-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Knowledge & Architecture' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <KnowledgePage />
}
