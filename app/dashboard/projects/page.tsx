import { ProjectsPage } from '@/components/dave/pages/projects-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Projects' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <ProjectsPage />
}
