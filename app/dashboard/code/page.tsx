import { CodePage } from '@/components/dave/pages/code-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Code & Pull Requests' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <CodePage />
}
