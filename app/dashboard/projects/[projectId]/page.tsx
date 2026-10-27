import { ProjectDetailPage } from '@/components/dave/pages/projects-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Project' }

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  await requireProductPath('dave_doctor')
  const { projectId } = await params
  return <ProjectDetailPage projectId={projectId} />
}
