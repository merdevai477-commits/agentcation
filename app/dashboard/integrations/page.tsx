import { IntegrationsPage } from '@/components/dave/pages/integrations-page'
import { requireProductPath } from '@/lib/dave/guard'

export const metadata = { title: 'Integrations' }

export default async function Page() {
  await requireProductPath('dave_doctor')
  return <IntegrationsPage />
}
