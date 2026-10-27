import { DaveReposPage } from '@/components/dave/repos-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Repositories' }

export default async function ReposRoute() {
  await requireProductPath('dave_doctor')
  return <DaveReposPage />
}
